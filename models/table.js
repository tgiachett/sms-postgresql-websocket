"use strict";

module.exports = function(sequelize, DataTypes) {
  const Table = sequelize.define('Table', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    smsBody: {
      type: DataTypes.STRING
    },
    SmsSid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    wholeBody: {
      type: DataTypes.STRING,
      allowNull: false
    }

  });
  return Table;
};