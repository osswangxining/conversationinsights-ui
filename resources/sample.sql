select * from entities;
select * from intents;
select * from synonyms where entity_id=1;
select * from synonym_variant;
select * from parameters where expression_id =1984 order by expression_id desc;
select * from expressions where intent_id=2 order by expression_id asc;
SELECT responses.response_text FROM responses, intents where responses.intent_id = intents.intent_id

-- delete from entities where entity_id >= 4;
delete from synonyms where synonym_id >= 4;
delete  from expressions;