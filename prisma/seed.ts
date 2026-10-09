import { createDb } from '../src/lib/client';
const db=createDb();
async function main(){if(await db.record.count())return;
await db.record.createMany({data:[
...[
['Leadership development','Coach and develop 5–6 HoDs through purposeful conversations. Support engineers who lead while working on productions.'],
['Workforce capability','Plan future skills, resilience and succession. Prepare evidence for senior leadership recruitment decisions.'],
['Cross-department coordination','Resolve shared dependencies and improve handovers without adding HoD administration.'],
['Operational improvement','Remove recurring friction and enable better delivery. Projects and Maintenance retain technical fault workflows.'],
['Strategic alignment','Translate Director priorities into delivery outcomes and communicate progress, risks and decisions.']
].map(([title,detail])=>({kind:'remit',title,detail})),
{kind:'objective',title:'Build a resilient capability plan',outcome:'Q4: map 5 critical capabilities and agree cover for 3 priority gaps.',detail:'Quarter 4 · October–December 2026',owner:'Delivery leader',due:'2026-12-18',progress:40,nextAction:'Validate capability gaps with department leads'},
{kind:'objective',title:'Make production handovers consistent',outcome:'Q4: pilot one shared handover on 4 productions and reduce repeat clarification by 25%.',detail:'Quarter 4 · October–December 2026',due:'2026-12-11',progress:25,owner:'Delivery leader'},
{kind:'activity',title:'HoD coaching conversation',detail:'Use an existing conversation; capture only your own follow-up.',cadence:'Weekly',due:'2026-10-12',nextAction:'Discuss delegation and one development goal',owner:'Delivery leader'},
{kind:'activity',title:'Monthly capability and capacity review',detail:'Review existing utilisation information; do not create a new return for HoDs.',cadence:'Monthly',due:'2026-10-30',owner:'Delivery leader'},
{kind:'initiative',title:'Production handover pilot',owner:'Alex Morgan · fictional lead',outcome:'A clearer handover that works when teams are away.',nextAction:'Agree the pilot with two department leads',benefit:'Fewer avoidable interruptions and clearer ownership',due:'2026-10-16',progress:35},
{kind:'initiative',title:'Critical skills coverage',owner:'Delivery leader',outcome:'Named development routes for priority capabilities',nextAction:'Resolve access to the existing skills summary',benefit:'More resilient production cover',due:'2026-10-14',progress:20,status:'Blocked'},
{kind:'review',title:'Week commencing 5 October',detail:'Achievements: agreed scope of handover pilot; held two coaching conversations.',outcome:'Blockers: capability summary needs validation.',nextAction:'Next priorities: validate gaps and book pilot review.',due:'2026-10-09'}
]});}
main().finally(()=>db.$disconnect());
