'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class art extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      art.hasOne(models.music, {
        as: 'musics',
        foreignKey: {
          name: 'idArtist'
        },
      });
    }
  }
  art.init({
    name: DataTypes.STRING,
    old: DataTypes.STRING,
    type: DataTypes.STRING,
    startCareer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'art',
  });
  return art;
};