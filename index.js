const first_rule_allow = ["required", "optional"]
const validate = ({ rule, body, exclude_body = false }) => {
    let _body = {}
    const rules_key = Object.keys(rule)
    for (let i = 0; i < rules_key.length; i++) {
        const rule_key = rules_key[i];
        const rule_data = rules[rule_key]

        const split_rule_msg = rule_data.split("|")
        if (split_rule_msg.length !== 2) throw new Error("Invalid rule expect xx|xx")

        const first_rule = split_rule_msg[0]
        const second_rule = split_rule_msg[1]

        if (!first_rule_allow.includes(first_rule)) {
            throw new Error(`Invalid first rule ${first_rule_allow}`)
        }

        if (first_rule === "required" && !body[rule_key]) {
            throw new Error(`400-${second_rule}`)
        }

        _body[rule_key] = body[rule_key]
    }

    if (!exclude_body) return body
    return _body
}
module.exports = validate