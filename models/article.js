const { Sequelize, DataTypes } = require('sequelize')

//init db
const mariadb = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: 'mariadb'
});

const Article = mariadb.define('Article',{
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue(title);
            return rawValue ? rawValue : null;
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue(description);
            return rawValue ? rawValue : null;
        }
    },
    markdown: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            const rawValue = this.getDataValue(markdown);
            return rawValue ? rawValue : null;
        }
    }


});

(async () => await mariadb.sync())()

module.exports = Article;

