# PrimeServerPartsBackend
## SEEDER FILE GENERATE
npx sequelize-cli seed:generate --name roles
## MIGRATION FILE GENERATE
npx sequelize-cli migration:generate --name roles
## MIGRATION MIGRATE TO THE DATABASE
yarn migrate:up
## MIGRATION UNDO ALL DATA
yarn migrate:undo
## SEED ALL SEEDER FILE
npx sequelize-cli db:seed:all
## DELETE ALL DATA FROM DATABASE
npx sequelize-cli db:seed:undo
## SEED ONLY ONE SEEDER FILE
npx sequelize db:seed --seed 20221128140702-roles.js
## DELETE SEPECIFIC TABLE DATA BY SEEDER NAME
npx sequelize-cli db:seed:undo --seed roles
