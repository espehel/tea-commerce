// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";
// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// We import object and document schemas
import blockContent from "./blockContent";
import category from "./category";
import product from "./product";
import vendor from "./vendor";
import productVariant from "./productVariant";
import merch from "./simple-product";

import localeString from "./locale/String";
import localeText from "./locale/Text";
import localeBlockContent from "./locale/BlockContent";
import order from "./order";
import orderline from "./orderline";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // document types
    product,
    vendor,
    category,
    merch,
    order,
    // object types
    blockContent,
    localeText,
    localeBlockContent,
    localeString,
    productVariant,
    orderline,
  ]),
});
