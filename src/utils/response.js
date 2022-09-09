// RESPONSE FORMATTER
module.exports = {
    groupResponse: () => {
        return {
            count: data ? data.length : 0,
            data: data
        }
    },
    singleResponse: (data) => {
        return data;
    }
}