'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class music extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      music.belongsTo(models.art, {
        as: "art",
        foreignKey: {
          name: "idArtist",
        },
      });
    }
  }
  music.init({
    title: DataTypes.STRING,
    year: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    attache: DataTypes.STRING,
    idArtist: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'music',
  });
  return music;
};