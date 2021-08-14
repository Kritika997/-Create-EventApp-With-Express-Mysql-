
exports.up = function(knex) {
    return knex.schema
    .createTable("user_modle",(table)=>{
        table.increments('user_id').primary()
        table.string("name",255).notNullable()
        table.string("email",255).notNullable()
        table.integer("phoneNumber",255).notNullable()
        table.string("role",255).notNullable()
    })
    .createTable("event_modle",(table)=>{
        table.increments('Evntid').primary()
        table.string("eventName",255).notNullable()
        table.string("discription",255).notNullable()
        table.integer("start_date",255).notNullable()
        table.integer("end_date",255).notNullable()
        table.string("city",255).notNullable()
        table.integer("user_id").references("user_id").inTable('user_modle').unsigned()
    })
  
};

exports.down = function(knex) {
  return knex.schema.dropTable("user_model").dropTable("event_model")
};