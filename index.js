const _mongoose = require("mongoose");

const first_rule_allow = ["required", "optional", "objectid"];
const thrid_rule_allow = ["exist", "notexist", "enum", "array", "string", "number", "boolean", "object", "objectid"];

const validate = async ({ rule, body, exclude_body = false }) => {
    let _body = {};
    const rules_key = Object.keys(rule);
    if (rules_key.length === 0) throw new Error(`No rule given`);
    for (let i = 0; i < rules_key.length; i++) {
        let rule_key = rules_key[i];

        const split_rule_key = rule_key.split(":");
        if (split_rule_key.length > 1) {
            rule_key = split_rule_key[0];
        }

        const rule_data = rule[rule_key];

        const split_rule_msg = rule_data.split("|");
        if (split_rule_msg.length < 2) throw new Error("Invalid rule expect xx|xx");

        const first_rule = split_rule_msg[0];
        const second_rule = split_rule_msg[1];
        let third_rule = "";

        if (split_rule_msg.length === 3) {
            third_rule = split_rule_msg[2].split(":");
            if (!thrid_rule_allow.includes(third_rule[0])) {
                throw new Error(`Invalid thrid rule ${thrid_rule_allow}`);
            }
        }

        if (!first_rule_allow.includes(first_rule)) {
            throw new Error(`Invalid first rule ${first_rule_allow}`);
        }

        if ((first_rule === "required" || first_rule === "objectid") && !body[rule_key] && typeof body[rule_key] !== "boolean") {
            throw new Error(`400-${second_rule}`);
        }

        if (first_rule === "objectid" && body[rule_key] && !body[rule_key].toString().match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error(`400-${second_rule}OBJ`);
        }

        if (third_rule[0] === "exist" && !third_rule[1]) throw new Error(`exist rule required model name`);
        if (third_rule[0] === "exist" || third_rule[0] === "notexist") {
            let target_key = rule_key;
            if (split_rule_key.length > 1) {
                target_key = split_rule_key[1];
            }
            const exist = await _mongoose.model(third_rule[1]).findOne({ [`${target_key}`]: body[rule_key], deleted_at: null });
            if ((third_rule[0] === "exist" && exist) || (third_rule[0] === "notexist" && !exist)) throw new Error(`400-${third_rule[1].toUpperCase()}204`);
        }

        if (third_rule[0] === "enum") {
            if (!third_rule[1]) {
                throw new Error(`enum rule required xx,xx`);
            }

            const valid_enum = third_rule[1].split(",");
            if (!valid_enum.includes(body[rule_key])) {
                throw new Error(`400-${second_rule}${rule_key.toUpperCase()}`);
            }
        }

        function _validator(_third_rule, value, obj_field = "") {
            if (_third_rule === "array" && !Array.isArray(value)) throw new Error(`400-${second_rule + obj_field.toUpperCase()}`);
            if (_third_rule === "string" && typeof value !== "string") throw new Error(`400-${second_rule + obj_field.toUpperCase()}`);
            if (_third_rule === "number" && typeof value !== "number") throw new Error(`400-${second_rule + obj_field.toUpperCase()}`);
            if (_third_rule === "boolean" && typeof value !== "boolean") throw new Error(`400-${second_rule + obj_field.toUpperCase()}`);
            if (_third_rule === "object" && (typeof value !== "object" || Array.isArray(value))) throw new Error(`400-${second_rule + obj_field.toUpperCase()}`);
            if (_third_rule === "objectid" && !value.toString().match(/^[0-9a-fA-F]{24}$/)) throw new Error(`400-${second_rule + obj_field.toUpperCase()}`);
        }
        _validator(third_rule[0], body[rule_key]);

        if (third_rule[0] === "object" && third_rule.length > 1) {
            const third_obj_rule = third_rule[1].split(",");
            const object_key = Object.keys(body[rule_key]);
            if (first_rule === "required" && object_key.length < 1) throw new Error(`400-${second_rule}`);
            if (third_obj_rule.length > 0) {
                for (let obj_i = 0; obj_i < third_obj_rule.length; obj_i++) {
                    const obj_str_rule = third_obj_rule[obj_i];
                    const split_obj_str_rule = obj_str_rule.split("/");
                    const obj_field = split_obj_str_rule[0];
                    const obj_data = body[rule_key][obj_field];

                    if (split_obj_str_rule.length > 1) {
                        const obj_rule = split_obj_str_rule[1].split("-");
                        if (obj_rule.length > 1) {
                            if (!first_rule_allow.includes(obj_rule[0])) {
                                throw new Error(`Invalid object rule ${first_rule_allow}`);
                            }
                            if (obj_rule[0] === "required" && !obj_data && typeof obj_data !== "boolean") throw new Error(`400-${second_rule + obj_field.toUpperCase()}`);
                            if ((obj_rule[0] === "optional" && obj_data !== "" && obj_data !== null && obj_data !== undefined) || obj_rule[0] === "required" || obj_data) {
                                _validator(obj_rule[1], obj_data, obj_field);
                            }
                        } else {
                            _validator(obj_rule[0], obj_data, obj_field);
                        }
                    }
                }
            }
        }

        _body[rule_key] = body[rule_key];
    }

    if (!exclude_body) {
        return body;
    }
    return _body;
};

module.exports = validate;
