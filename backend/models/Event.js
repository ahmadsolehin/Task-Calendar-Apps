import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Event = db.define('event', {
    title: {
        type: DataTypes.STRING
    },
    start: {
        type: DataTypes.DATE
    },
    end: {
        type: DataTypes.DATE
    },
    assign_from: {
        type: DataTypes.STRING
    },
    assign_to: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});

(async () => {
    await db.sync();
})();

export default Event;