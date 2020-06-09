exports.seed = function (knex) {
  const users = [
    {
      username: "mortalman", password: "1234", department: "pied piper"
    },
    {
      username: "robot", password: "corrodes", department: "teacher"
    }
  ];

  return knex('users')
  .insert(users)
  .then(()=> console.log("\n== Seed data for users has been added. ==\n"))
}
