import Foundation
import AppKit
import Darwin
import ServiceManagement

@main
final class LeadershipOS: NSObject, NSApplicationDelegate {
    private var statusItem: NSStatusItem!
    private var statusLine: NSMenuItem!
    private var loginItem: NSMenuItem!
    private var server: Process?
    private var logHandle: FileHandle?
    private var timer: Timer?
    private var ready = false
    private var stopping = false
    private var attempts = 0
    private var instance = UUID().uuidString
    private let baseURL = "http://localhost:3000"
    private let support = FileManager.default.homeDirectoryForCurrentUser
        .appendingPathComponent("Library/Application Support/LeadershipOS", isDirectory: true)

    static func main() {
        let app = NSApplication.shared
        let delegate = LeadershipOS()
        app.delegate = delegate
        app.setActivationPolicy(.accessory)
        withExtendedLifetime(delegate) { app.run() }
    }

    func applicationDidFinishLaunching(_ notification: Notification) {
        let identifier = Bundle.main.bundleIdentifier ?? "local.leadershipos.menubar"
        if NSRunningApplication.runningApplications(withBundleIdentifier: identifier).count > 1 {
            NSApplication.shared.terminate(nil)
            return
        }
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        let image = NSImage(systemSymbolName: "target", accessibilityDescription: "LeadershipOS")
        image?.isTemplate = true
        statusItem.button?.image = image
        statusItem.button?.toolTip = "LeadershipOS"
        let menu = NSMenu()
        statusLine = NSMenuItem(title: "Starting LeadershipOS…", action: nil, keyEquivalent: "")
        menu.addItem(statusLine)
        menu.addItem(.separator())
        add(menu, "Open LeadershipOS", #selector(openDashboard), "o")
        add(menu, "My weekly checklist", #selector(openChecklist))
        add(menu, "Meetings and agendas", #selector(openMeetings))
        add(menu, "Write my weekly note", #selector(openReview))
        menu.addItem(.separator())
        loginItem = add(menu, "Open at login", #selector(toggleLogin))
        add(menu, "Login settings…", #selector(openLoginSettings))
        add(menu, "Restart background app", #selector(restart))
        add(menu, "Show logs", #selector(showLogs))
        add(menu, "Open data folder", #selector(showData))
        menu.addItem(.separator())
        add(menu, "Quit LeadershipOS", #selector(quit), "q")
        menu.autoenablesItems = false
        statusLine.isEnabled = false
        statusItem.menu = menu
        updateLoginState()
        startServer()
    }

    @discardableResult
    private func add(_ menu: NSMenu, _ title: String, _ action: Selector, _ key: String = "") -> NSMenuItem {
        let item = NSMenuItem(title: title, action: action, keyEquivalent: key)
        item.target = self
        menu.addItem(item)
        return item
    }

    private func alert(_ title: String, _ text: String) {
        NSApplication.shared.activate(ignoringOtherApps: true)
        let message = NSAlert()
        message.messageText = title
        message.informativeText = text
        message.addButton(withTitle: "OK")
        message.runModal()
    }

    private func startServer() {
        stopping = false
        ready = false
        attempts = 0
        instance = UUID().uuidString
        statusLine.title = "Starting LeadershipOS…"
        do {
            guard let resources = Bundle.main.resourceURL else { throw StartupError.missingFiles }
            let nodeFile = resources.appendingPathComponent("node-path.txt")
            let nodePath = try String(contentsOf: nodeFile, encoding: .utf8).trimmingCharacters(in: .whitespacesAndNewlines)
            guard FileManager.default.isExecutableFile(atPath: nodePath) else { throw StartupError.missingNode }
            let web = resources.appendingPathComponent("web", isDirectory: true)
            let entry = web.appendingPathComponent("server.js")
            let database = support.appendingPathComponent("leadership.db")
            guard FileManager.default.fileExists(atPath: entry.path),
                  FileManager.default.fileExists(atPath: database.path) else { throw StartupError.missingFiles }
            try FileManager.default.createDirectory(at: support, withIntermediateDirectories: true,
                                                    attributes: [.posixPermissions: 0o700])
            let log = support.appendingPathComponent("server.log")
            if !FileManager.default.fileExists(atPath: log.path) {
                FileManager.default.createFile(atPath: log.path, contents: nil, attributes: [.posixPermissions: 0o600])
            }
            logHandle = try FileHandle(forWritingTo: log)
            try logHandle?.seekToEnd()
            let process = Process()
            process.executableURL = URL(fileURLWithPath: nodePath)
            process.arguments = [entry.path]
            process.currentDirectoryURL = web
            var environment = ProcessInfo.processInfo.environment
            environment["NODE_ENV"] = "production"
            environment["HOSTNAME"] = "127.0.0.1"
            environment["PORT"] = "3000"
            environment["DATABASE_URL"] = "file:" + database.path
            environment["LEADERSHIPOS_INSTANCE"] = instance
            environment["NEXT_TELEMETRY_DISABLED"] = "1"
            process.environment = environment
            process.standardOutput = logHandle
            process.standardError = logHandle
            process.terminationHandler = { [weak self, weak process] _ in
                DispatchQueue.main.async {
                    guard let self = self, self.server === process, !self.stopping else { return }
                    self.timer?.invalidate()
                    self.ready = false
                    self.statusLine.title = "Background app stopped — restart it"
                    self.alert("LeadershipOS could not keep running",
                               "Choose Show logs to see what happened. If port 3000 is already in use, stop the old npm run dev session with Control+C, then choose Restart background app. Your data is kept safe.")
                }
            }
            server = process
            try process.run()
            timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in self?.checkReady() }
        } catch {
            statusLine.title = "Could not start — reinstall or check logs"
            alert("LeadershipOS could not start", "\(error.localizedDescription)\nRun npm run mac:install from the project folder to repair this installation. Keep Node.js installed.")
        }
    }

    private func checkReady() {
        guard !ready, let process = server, process.isRunning else { return }
        attempts += 1
        if attempts > 90 {
            stopServer()
            statusLine.title = "Startup took too long — restart it"
            alert("LeadershipOS is not ready", "Choose Show logs to see the startup problem, then choose Restart background app. No saved data has been deleted.")
            return
        }
        var request = URLRequest(url: URL(string: baseURL + "/api/local-health")!)
        request.timeoutInterval = 2
        request.cachePolicy = .reloadIgnoringLocalCacheData
        let expected = instance
        URLSession.shared.dataTask(with: request) { [weak self] data, response, _ in
            guard let data = data, (response as? HTTPURLResponse)?.statusCode == 200,
                  let result = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  result["app"] as? String == "LeadershipOS", result["instance"] as? String == expected else { return }
            DispatchQueue.main.async {
                guard let self = self, self.instance == expected, self.server?.isRunning == true, !self.stopping, !self.ready else { return }
                self.ready = true
                self.timer?.invalidate()
                self.statusLine.title = "Running in the background"
                if !UserDefaults.standard.bool(forKey: "openedDashboardOnce") {
                    UserDefaults.standard.set(true, forKey: "openedDashboardOnce")
                    self.openDashboard()
                }
            }
        }.resume()
    }

    private func stopServer() {
        stopping = true
        ready = false
        timer?.invalidate()
        if let process = server, process.isRunning {
            process.terminate()
            let deadline = Date().addingTimeInterval(5)
            while process.isRunning && Date() < deadline { usleep(50_000) }
            if process.isRunning { kill(process.processIdentifier, SIGKILL) }
            process.waitUntilExit()
        }
        server = nil
        try? logHandle?.close()
        logHandle = nil
    }

    private func open(_ path: String = "/") {
        guard ready else {
            alert("LeadershipOS is not ready yet", "Wait for the menu to say Running in the background. If it stopped, choose Restart background app or Show logs.")
            return
        }
        if let url = URL(string: baseURL + path) { NSWorkspace.shared.open(url) }
    }
    @objc private func openDashboard() { open() }
    @objc private func openChecklist() { open("/?view=activity") }
    @objc private func openMeetings() { open("/?view=meeting") }
    @objc private func openReview() { open("/?view=review") }
    @objc private func restart() { stopServer(); startServer() }
    @objc private func showLogs() { NSWorkspace.shared.open(support.appendingPathComponent("server.log")) }
    @objc private func showData() { NSWorkspace.shared.open(support) }
    @objc private func openLoginSettings() { SMAppService.openSystemSettingsLoginItems() }
    private func updateLoginState() {
        switch SMAppService.mainApp.status {
        case .enabled: loginItem.state = .on
        case .requiresApproval: loginItem.state = .mixed
        default: loginItem.state = .off
        }
    }
    @objc private func toggleLogin() {
        do {
            if SMAppService.mainApp.status == .enabled || SMAppService.mainApp.status == .requiresApproval {
                try SMAppService.mainApp.unregister()
            } else {
                try SMAppService.mainApp.register()
                if SMAppService.mainApp.status == .requiresApproval {
                    alert("Allow LeadershipOS at login", "Open Login settings from this menu and allow LeadershipOS. This is a macOS setting.")
                }
            }
            updateLoginState()
        } catch { alert("Could not change login setting", error.localizedDescription + "\nYou can also add LeadershipOS manually in System Settings → General → Login Items.") }
    }
    @objc private func quit() { NSApplication.shared.terminate(nil) }
    func applicationWillTerminate(_ notification: Notification) { stopServer() }
}

private enum StartupError: LocalizedError {
    case missingFiles, missingNode
    var errorDescription: String? {
        switch self {
        case .missingFiles: return "The installed app or local database is incomplete."
        case .missingNode: return "The Node.js runtime recorded during installation is no longer available."
        }
    }
}
