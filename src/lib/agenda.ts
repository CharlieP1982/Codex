import {z} from 'zod';
export const topicSchema=z.object({
 title:z.string().trim().min(1,'Give each agenda topic a name.').max(300),
 purpose:z.enum(['Discuss','Decide','Update']),
 owner:z.string().trim().max(120),minutes:z.number().int().min(0).max(240),
});
export const agendaSchema=z.object({version:z.literal(1),topics:z.array(topicSchema).max(30)});
export type AgendaTopic=z.infer<typeof topicSchema>;
export function readAgenda(value:string):AgendaTopic[]{
 try{const parsed=agendaSchema.safeParse(JSON.parse(value));if(parsed.success)return parsed.data.topics;}catch{}
 return value.split('\n').map(title=>title.trim()).filter(Boolean).map(title=>({title,purpose:'Discuss' as const,owner:'',minutes:0}));
}
export function validAgenda(value:string){
 if(!value.trim().startsWith('{'))return true;
 try{return agendaSchema.safeParse(JSON.parse(value)).success;}catch{return false;}
}
export const agendaTemplates:Record<string,AgendaTopic[]>={
 hod:[{title:'How are things going?',purpose:'Discuss',owner:'',minutes:10},{title:'Support or development needed',purpose:'Discuss',owner:'',minutes:10},{title:'Agree the next steps',purpose:'Decide',owner:'',minutes:5}],
 team:[{title:'What is coming up across departments?',purpose:'Update',owner:'',minutes:10},{title:'Shared problems and handovers',purpose:'Discuss',owner:'',minutes:15},{title:'Decisions and who will do what',purpose:'Decide',owner:'',minutes:10}],
 director:[{title:'Progress on my main goals',purpose:'Update',owner:'',minutes:10},{title:'Problems and support needed',purpose:'Discuss',owner:'',minutes:10},{title:'Decisions I need from my Director',purpose:'Decide',owner:'',minutes:10}],
};
