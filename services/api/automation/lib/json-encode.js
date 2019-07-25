
const jsonEncode = v => v ? JSON.stringify(v) : null
const jsonDecode = v => v ? JSON.parse(v) : null

module.exports = {
    jsonEncode,
    jsonDecode,
}
