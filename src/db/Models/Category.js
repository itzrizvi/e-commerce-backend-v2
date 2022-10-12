// Category Model
module.exports = (sequelize, DataTypes) => {

    const Category = sequelize.define("categories", {
        cat_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
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
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cat_sort_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        cat_status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false
        },
        is_featured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        tenant_id: {
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