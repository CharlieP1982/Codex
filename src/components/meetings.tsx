import type {Record as Entry} from '@prisma/client';
import { meetingDetail } from '@/lib/meetings';
import { saveMeeting,saveMeetingAction,copyNextMeeting } from '@/app/actions';
function MeetingForm({entry}:{entry?:Entry}){
 const detail=meetingDetail(entry?.detail??'');
 return <form action={saveMeeting} className="grid gap-4 mt-4">
 <input type="hidden" name="id" value={entry?.id??''}/>
 <label>Meeting name<input name="title" required maxLength={160} defaultValue={entry?.title??''} placeholder="For example: monthly department leads meeting"/></label>
 <label>Who is coming?<input name="participants" maxLength={500} defaultValue={entry?.owner??''} placeholder="Use roles or fictional names"/></label>
 <div className="grid sm:grid-cols-2 gap-4"><label>Date<input type="date" name="due" required defaultValue={entry?.due??''}/></label><label>Time<input type="time" name="time" required defaultValue={detail.time}/></label></div>
 <p className="text-xs muted">Use the local time you have agreed with attendees. This app does not send invitations.</p>
 <label>What do we need to talk about?<textarea name="agenda" maxLength={8000} defaultValue={detail.agenda} placeholder="One topic per line. Include questions and decisions needed."/></label>
 <label>Notes from the meeting<textarea name="notes" maxLength={8000} defaultValue={detail.notes}/></label>
 <label>What did we decide?<textarea name="decisions" maxLength={4000} defaultValue={entry?.outcome??''}/></label>
 <div className="grid sm:grid-cols-2 gap-4"><label>Will this meeting repeat?<select name="repeat" required defaultValue={entry?detail.repeat:''}><option value="" disabled>Choose how often</option><option value="Once">One meeting only</option><option value="Weekly">Every week</option><option value="Monthly">Every month</option></select></label><label>Has it happened?<select name="status" required defaultValue={entry?.status??''}><option value="" disabled>Choose an answer</option><option value="Active">Not yet</option><option value="Complete">Yes, finished</option></select></label></div>
 <button className="button justify-self-start">{entry?'Save meeting':'Add meeting'}</button></form>;
}
function ActionForm({meetingId,entry}:{meetingId:string;entry?:Entry}){
 return <form action={saveMeetingAction} className="grid gap-3 mt-3"><input type="hidden" name="id" value={entry?.id??''}/><input type="hidden" name="meetingId" value={meetingId}/><label>What needs doing?<input name="title" required maxLength={160} defaultValue={entry?.title??''}/></label><div className="grid sm:grid-cols-2 gap-3"><label>Who will do it?<input name="owner" required maxLength={120} defaultValue={entry?.owner??''}/></label><label>By when?<input name="due" type="date" required defaultValue={entry?.due??''}/></label></div><input type="hidden" name="status" value={entry?.status??'Active'}/><button className="button justify-self-start">{entry?'Save action':'Add action'}</button></form>;
}
export function Meetings({records,today}:{records:Entry[];today:string}){
 const meetings=records.filter(r=>r.kind==='meeting').sort((a,b)=>a.due.localeCompare(b.due)||meetingDetail(a.detail).time.localeCompare(meetingDetail(b.detail).time));
 const actions=records.filter(r=>r.kind==='meeting-action');
 return <div className="grid gap-6"><section className="card"><h2>Plan the conversation, then keep the next steps</h2><p className="muted text-sm mt-2">Use this for meetings with department leaders, your Director or other teams. Write an agenda, keep short notes and track what was agreed. Nobody else needs to fill in this app.</p><p className="text-sm mt-3">{meetings.filter(m=>m.status!=='Complete'&&m.due>=today).length} upcoming meetings · {actions.filter(a=>a.status!=='Complete').length} actions still to do</p></section>
 <section className="card"><h2>Plan a meeting</h2><MeetingForm/></section>
 {meetings.length===0&&<p className="card muted">No meetings yet. Start by adding one above.</p>}
 {meetings.map(meeting=>{const detail=meetingDetail(meeting.detail);const followups=actions.filter(a=>a.benefit===meeting.id);return <article className="card scroll-mt-6" key={meeting.id} id={'meeting-'+meeting.id}>
 <div className="flex flex-wrap justify-between gap-3"><h2>{meeting.title}</h2><span className="badge">{meeting.status==='Complete'?'Finished':meeting.due<today?'Past date — check status':'Planned'}</span></div>
 <p className="text-sm muted mt-3">{new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(meeting.due))} · {detail.time} · {detail.repeat==='Once'?'One meeting':detail.repeat==='Weekly'?'Every week':'Every month'}</p>
 <p className="text-sm mt-2">Who is coming: {meeting.owner||'Not added yet'}</p>
 <div className="grid md:grid-cols-3 gap-5 mt-5">{[['Agenda',detail.agenda],['Notes',detail.notes],['Decisions',meeting.outcome]].map(([label,value])=><section key={label}><h3>{label}</h3><p className="text-sm muted whitespace-pre-wrap mt-2">{value||'Nothing added yet.'}</p></section>)}</div>
 <section className="mt-6 border-t border-[#e5e0e7] pt-5"><h3>Actions and follow-ups</h3><p className="text-xs muted mt-1">{followups.filter(a=>a.status==='Complete').length} of {followups.length} done</p>
 {followups.map(action=><div key={action.id} className="mt-4 rounded-lg border border-[#e5e0e7] p-4"><p className={'text-sm font-semibold '+(action.status==='Complete'?'line-through':'')}>{action.title}</p><p className="text-xs muted mt-2">{action.owner} · by {action.due}{action.status!=='Complete'&&action.due<today?' · overdue':''}</p><form action={saveMeetingAction} className="mt-3"><input type="hidden" name="id" value={action.id}/><input type="hidden" name="meetingId" value={meeting.id}/><input type="hidden" name="title" value={action.title}/><input type="hidden" name="owner" value={action.owner}/><input type="hidden" name="due" value={action.due}/><input type="hidden" name="status" value="Active"/><label className="flex items-center gap-2"><input type="checkbox" name="status" value="Complete" defaultChecked={action.status==='Complete'} className="!w-4 !mt-0"/>Done</label><button className="button mt-3">Save tick</button></form><details className="mt-3"><summary className="text-xs">Edit this action</summary><ActionForm meetingId={meeting.id} entry={action}/></details></div>)}
 <details className="mt-4"><summary className="font-semibold text-sm">Add a next step</summary><ActionForm meetingId={meeting.id}/></details></section>
 <details className="mt-5"><summary className="text-sm font-semibold">Edit agenda, notes or meeting details</summary><MeetingForm entry={meeting}/></details>
 {detail.repeat!=='Once'&&<form action={copyNextMeeting} className="mt-5"><input type="hidden" name="id" value={meeting.id}/><button className="button">Plan the next {detail.repeat==='Weekly'?'weekly':'monthly'} meeting</button><p className="text-xs muted mt-2">Creates a new meeting with the same agenda and attendees. Notes, decisions and actions start empty. It does not finish this meeting or send invitations.</p></form>}
 </article>})}</div>;
}
