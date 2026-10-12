import Link from 'next/link';
const areas = [
  {
    title: '1. Help department leaders become better managers',
    meaning: 'Give your 5–6 Heads of Department support to lead people well, while recognising that they are operational engineers and often away on productions.',
    start: 'You own their leadership development: useful coaching conversations, helping them delegate, and agreeing practical development steps.',
    end: 'HoDs continue to handle routine staff matters and run their departments. You support their judgement rather than taking over every staff conversation.',
    example: 'A HoD keeps doing everything themselves. Help them choose one responsibility to delegate and check how it went at your next conversation.',
    result: 'Department leaders can handle more situations confidently without needing you to step in.',
    use: 'Record a coaching check-in in Regular check-ins. Track a wider development goal in My goals.',
  },
  {
    title: '2. Make sure the right skills are available for future work',
    meaning: 'Look ahead at what engineering delivery will need and where skills or cover may be missing.',
    start: 'You own planning staff skills and training: identify important skill gaps, consider training and cover, and prepare evidence when recruitment may be needed.',
    end: 'HoDs manage department workload and routine staff matters. Senior leadership approves recruitment. You can identify a need and recommend action; that does not give you recruitment approval.',
    example: 'Only one person can cover an important skill. Use existing information to work with the HoD on a practical training or cover plan. Take any recruitment request to senior leadership.',
    result: 'Important work has a realistic skills and cover plan, and unresolved gaps are visible to the people who can decide.',
    use: 'Put the result you want in My goals and the training or cover work in Things to improve.',
  },
  {
    title: '3. Help departments work together',
    meaning: 'Step in where work crosses department boundaries and needs a shared decision or a clearer handover.',
    start: 'You own helping teams work together: bring the right people together, clarify shared responsibilities and agree the next step.',
    end: 'HoDs keep ownership of their own departments. You do not become the person who allocates every engineer or maintains another department workload tracker.',
    example: 'Two departments each expect the other to finish a handover. Agree who owns each part and when the handover is ready, using the systems already in place.',
    result: 'People know who is doing what, and fewer jobs get stuck between departments.',
    use: 'Track the shared change in Things to improve, with one person taking it forward and a clear next step.',
  },
  {
    title: '4. Make the way work runs easier',
    meaning: 'Notice recurring problems in how teams work and help make practical changes.',
    start: 'You own making things better: choose a recurring source of friction, agree a small change, try it and check whether it helped.',
    end: 'Projects and Maintenance retain their established technical fault workflows. A fault still goes through those routes. This app is not another fault log or a reason to create extra HoD returns.',
    example: 'Teams repeatedly have to ask for missing handover information. Try a clearer handover within the existing workflow and check whether repeat questions decrease.',
    result: 'Less avoidable effort, clearer handovers and changes that actually help the people doing the work.',
    use: 'Use Things to improve to record the change, why it helps and the next small step. Use My week to note what you learned.',
  },
  {
    title: '5. Set useful priorities and keep your Director informed',
    meaning: 'Turn the direction you have into a small number of useful delivery goals, including when day-to-day direction is limited.',
    start: 'Your role is to propose priorities within your responsibilities, explain why they matter, track progress and raise decisions or risks with the UK Director of Operations.',
    end: 'Your autonomy does not replace senior leadership decisions. Recruitment approvals remain with senior leadership. Check with your Director when priorities conflict or a decision goes beyond your authority.',
    example: 'You see a future skills gap and a recurring handover problem. Propose which to address first, explain the reasons, and ask your Director to resolve any competing priorities or approval needs.',
    result: 'You can explain what you are working on, why it matters, what has changed and where a decision is needed.',
    use: 'Put agreed goals in My goals. Use My week to capture progress and questions for your next Director conversation.',
  },
];
export function JobReference() {
  return <div className="grid gap-6">
    <section className="card">
      <h2>Your job in one sentence</h2>
      <p className="mt-3 text-lg">Help your department leaders and engineering teams deliver well, build the skills they need, and improve how they work together.</p>
      <p className="muted text-sm mt-3">You are Head of Engineering Delivery, reporting to the UK Director of Operations and leading 5–6 Heads of Department.</p>
      <p className="muted text-sm mt-3">This is a working reference based on the role you described in our chat. Use it alongside your company’s formal job description and agreed authority. The examples below are illustrative.</p>
    </section>
    <section className="card">
      <h2>A quick way to decide: is this mine?</h2>
      <ul className="list-disc pl-5 space-y-3 text-sm mt-4">
        <li><strong>Developing leaders, planning future skills, joining up departments or improving how work runs?</strong> That sits within your responsibilities.</li>
        <li><strong>Routine staff matters or department workload?</strong> The HoD owns those. Support them where useful.</li>
        <li><strong>A technical fault?</strong> Use the established Projects or Maintenance workflow.</li>
        <li><strong>Recruitment approval?</strong> Senior leadership decides. You can prepare the evidence and recommendation.</li>
        <li><strong>Unclear authority or competing priorities?</strong> Bring a clear question and your recommendation to your Director.</li>
      </ul>
    </section>
    {areas.map(area => <section key={area.title} className="card">
      <h2>{area.title}</h2><p className="text-sm muted mt-3">{area.meaning}</p>
      <div className="grid md:grid-cols-2 gap-4 mt-5">
        <div className="rounded-lg bg-[#fff0e7] p-4"><h3>Where my responsibility starts</h3><p className="text-sm mt-2">{area.start}</p></div>
        <div className="rounded-lg border border-[#e5e0e7] p-4"><h3>Where my responsibility ends</h3><p className="text-sm mt-2">{area.end}</p></div>
      </div>
      <div className="mt-5"><h3>A real-world example</h3><p className="text-sm muted mt-2">{area.example}</p></div>
      <div className="mt-5"><h3>How I know I am helping</h3><p className="text-sm muted mt-2">{area.result}</p></div>
      <div className="mt-5"><h3>Where to keep it in this app</h3><p className="text-sm muted mt-2">{area.use}</p></div>
    </section>)}
    <section className="card"><h2>Keep it light</h2><p className="text-sm muted mt-3">Use conversations and information that already exist. Keep your own next steps here. Your HoDs should not need to complete another report or use another system for this app.</p><Link href="/?view=remit" className="button mt-4">Open My responsibilities</Link><p className="text-xs muted mt-3">This reference explains the role. My responsibilities holds your editable notes about it.</p></section>
  </div>;
}
