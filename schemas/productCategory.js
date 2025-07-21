export default {
  name: 'productCategory',
  title: 'Product Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Hex color code for category identification',
    },
    {
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this category is active and available for use',
    },
  ],
  preview: {
    select: {
      title: 'name',
      description: 'description',
      active: 'active',
    },
    prepare({title, description, active}) {
      return {
        title: title || 'Untitled Category',
        subtitle: description || (active ? 'Active' : 'Inactive'),
      }
    },
  },
} 