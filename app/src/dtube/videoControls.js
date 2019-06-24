
class VideoControls {
    constructor(self) { this.self = self }


    whitelist = {
        add(QmOrPermlink) {

        },
        remove(QmOrPermlink) {

        },
        has(QmOrPermlink) {

        }
    }
    blocklist = {
        add(QmOrPermlink) {
            self.dataStore.getItem("blocklist", (err, value) => {
                currentlist.push(QmOrPermlink);
                self.dataStore.setItem("blocklist", currentlist)
            })
        },
        remove(QmOrPermlink) {
            self.dataStore.getItem("blocklist", (err, value) => {
                for (var i = 0; i < currentlist.length; i++) {
                    if (value[i] === QmOrPermlink) {
                        value.splice(i, 1);
                    }
                }
                self.dataStore.setItem("blocklist", value)
            })
        },
        has(QmOrPermlink) {

        }
    }
    isBlocked(QmOrPermlink, cb) {
        if (this.whitelist.has(QmOrPermlink)) {
            return true;
        }
        if (this.blocklist.has(QmOrPermlink)) {
            return false;
        }
        return true;
    }
}
exports = module.exports = VideoControls;