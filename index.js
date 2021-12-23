const _mongoose = require("mongoose")

const first_rule_allow = ["required", "optional", "objectid"]
const thrid_rule_allow = ["exist"]
const validate = async ({ rule, body, exclude_body = false }) => {

    let _body = {}
    const rules_key = Object.keys(rule)
    if (rules_key.length === 0) throw new Error(`No rule given`)
    for (let i = 0; i < rules_key.length; i++) {
        let rule_key = rules_key[i];
        
        
        const split_rule_key = rule_key.split(":")
        if (split_rule_key.length > 1) {
            rule_key = split_rule_key[0]
        }

        const rule_data = rule[rule_key]

        const split_rule_msg = rule_data.split("|")
        if (split_rule_msg.length < 2) throw new Error("Invalid rule expect xx|xx")

        const first_rule = split_rule_msg[0]
        const second_rule = split_rule_msg[1]
        let third_rule = ""

        if (split_rule_msg.length === 3) {
            third_rule = split_rule_msg[2].split(":")
            if (!thrid_rule_allow.includes(third_rule[0])) {
                throw new Error(`Invalid thrid rule ${thrid_rule_allow}`)
            }
        }


        if (!first_rule_allow.includes(first_rule)) {
            throw new Error(`Invalid first rule ${first_rule_allow}`)
        }

        if ((first_rule === "required" || first_rule === "objectid") && !body[rule_key]) {
            throw new Error(`400-${second_rule}`)
        }

        if (first_rule === "objectid" && !body[rule_key].toString().match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error(`400-${second_rule}OBJ`)
        }

        if (third_rule[0] === "exist" && !third_rule[1]) throw new Error(`exist rule required model name`)
        if (third_rule[0] === "exist") {
            let target_key = rule_key
            if (split_rule_key.length > 1) {
                target_key = split_rule_key[1]
            }

            const exist = await _mongoose.model(third_rule[1]).findOne({ [`${target_key}`]: body[rule_key], deleted_at: null })
            if (exist) throw new Error(`400-${third_rule[1].toUpperCase()}4000}`)
        }

        _body[rule_key] = body[rule_key]
    }

    if (!exclude_body) return body
    return _body

}

module.exports = validate