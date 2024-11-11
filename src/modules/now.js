const nowFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "America/Los_Angeles",
});

const formatDate = (date) =>  {
    return nowFormatter.format((date || new Date()));
}
export {nowFormatter,formatDate}