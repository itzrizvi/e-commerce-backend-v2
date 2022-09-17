// Category Model
module.exports = (sequelize, DataTypes) => {

    const Category = sequelize.define("categories", {
        cat_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        cat_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cat_slug: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cat_description: {
            type: DataTypes.JSON,
            allowNull: true
        },
        cat_parent_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        cat_meta_tag_title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cat_meta_tag_description: {
            type: DataTypes.JSON,
            allowNull: true
        },
        cat_meta_tag_keywords: {
            type: DataTypes.JSON,
            allowNull: true
        },
        cat_image: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        cat_sort_order: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cat_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: false
        }

    }, {
        timestamps: true,
        freezeTableName: true,
        tableName: 'categories',
    })

    return Category
}