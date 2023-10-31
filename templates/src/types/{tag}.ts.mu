{{#objects}}
export type {{entityName}} = {
{{typeString}}
}
{{/objects}}
{{^objects}}
export default undefined
{{#objects}}