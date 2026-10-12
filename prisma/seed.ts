import { createDb } from '../src/lib/client';
const db=createDb();
async function main(){if(await db.record.count())return;
await db.record.createMany({data:[
...[
['Helping department leaders','Help your 5–6 department leaders manage people well, including when they are away on productions.'],
['Staff skills and training','Plan the skills and training teams will need. Explain any staffing gaps to senior leaders, who approve recruitment.'],
['Helping teams work together','Help teams agree who does what and improve handovers. Use existing information rather than extra forms.'],
['Making things better','Fix problems in how work runs. Technical faults still go through Projects and Maintenance.'],
['Main goals and updates for my boss','Agree useful goals with your Director and explain progress, problems and decisions needed.']
].map(([title,detail])=>({kind:'remit',title,detail})),
{kind:'objective',title:'Make a staff skills and training plan',outcome:'By December: list five important skills and agree cover for three gaps.',detail:'Quarter 4 · October–December 2026',owner:'Delivery leader',due:'2026-12-18',progress:0,nextAction:'Ask department leaders to check the skills gaps'},
{kind:'objective',title:'Make production handovers consistent',outcome:'By December: try a shared handover on four productions and reduce repeat questions by 25%.',detail:'Quarter 4 · October–December 2026',due:'2026-12-11',progress:0,owner:'Delivery leader'},
{kind:'activity',title:'Talk with a department leader',detail:'Use a conversation already in the diary. Keep only your own next steps.',cadence:'Weekly',due:'2026-10-12',nextAction:'Talk about sharing work and one skill to practise',owner:'Delivery leader'},
{kind:'activity',title:'Monthly staff skills and workload check',detail:'Use the workload information that already exists. No extra report for department leaders.',cadence:'Monthly',due:'2026-10-30',owner:'Delivery leader'},
{kind:'initiative',title:'Try a clearer production handover',owner:'Alex Morgan · fictional lead',outcome:'A clearer handover that works when teams are away.',nextAction:'Agree a small trial with two department leaders',benefit:'Fewer avoidable interruptions and clearer ownership',due:'2026-10-16',progress:0},
{kind:'initiative',title:'Cover important skills',owner:'Delivery leader',outcome:'Agree training for the most important missing skills',nextAction:'Get the existing staff skills list',benefit:'More resilient production cover',due:'2026-10-14',progress:0},
{kind:'review',title:'Week commencing 5 October',detail:'Achievements: agreed scope of handover pilot; held two coaching conversations.',outcome:'Blockers: capability summary needs validation.',nextAction:'Next priorities: validate gaps and book pilot review.',due:'2026-10-09'}
]});}
main().finally(()=>db.$disconnect());
