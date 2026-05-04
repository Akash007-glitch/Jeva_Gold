import type { Schema, Struct } from '@strapi/strapi';

export interface ProductVariant extends Struct.ComponentSchema {
  collectionName: 'components_product_variants';
  info: {
    description: 'Size variant with its own price and stock';
    displayName: 'Variant';
  };
  attributes: {
    price: Schema.Attribute.Decimal & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<['100g', '250g', '500g']> &
      Schema.Attribute.Required;
    stock: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.variant': ProductVariant;
    }
  }
}
