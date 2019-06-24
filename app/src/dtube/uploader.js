const EventEmitter = require('events')
const uuidv4 = require('uuid/v4');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg'); ffmpeg.setFfmpegPath(ffmpegPath);
const mergImg = require('merge-img');
const tmp = require('tmp');
const { promisify } = require('es6-promisify');

class VideoUpload {
    constructor(base) {
        this.base = base;
        this.metadata = {videos: {formats:[], qualities:[]}};
    }
}

var defaultQualities = ['240p', '480p', '720p'];
var resolve_qualities = {
    "144p": "256x144",
    "240p": "320x240",
    "360p": "480x360",
    "480p": "858x480",
    "720p": "1280x720",
    "1080p": "1920x1080",
    "2160p": "3860x2160"
};
class uploader extends EventEmitter {

    constructor(self) {
        super();
        this.self = self;
        this.uploadsInProgress = {};
    }
    uploadVideoFromfs(fsPath, token, options) {
        if (options.qualities) options.qualities = defaultQualities;
        if (options.format) options.format = "mp4";
        if (this.uploadsInProgress[token] === undefined) throw "invalid upload token."

        switch (options.format) {
            case "mp4":

            case "hls":

            default:
                throw "Invalid video format"
        }
        return new Promise((resolve, reject) => {




        });
    }
    ffmpegPromise(cmd) {
        return new Promise((resolve, reject) => {
            cmd.on('end', (stdout, stderr) => {

                resolve({ msg: "done", cmd: cmd })
            }).run();
        });
    }
    /**
     * Resolves list of paths to encoded .mp4 files
     * @param {Video file to encode.} fsPath 
     * @param {List of qualities} qualitites 
     */
    EncodeVideo(fsPath, qualitites, formats, progressMonitor) {
        if (formats === undefined) formats = ["mp4"]; //Default the format
        if(progressMonitor === undefined) progressMonitor = () =>{};
        var results = { mp4: [], hls: [] };

        return new Promise((resolve, reject) => {
            var tmp_dir = tmp.dirSync().name; //Generate temp directory

            const run = async () => {
                //Format loop
                console.log(formats);
                console.log(qualitites);
                for (var x = 0; x < formats.length; x++) {
                    var format = formats[x];
                    console.log(format)
                    //Encoding loop!
                    for (var y = 0; y < qualitites.length; y++) {
                        var quality = qualitites[y];
                        var qualityWxH = resolve_qualities[quality];
                        console.log(qualityWxH)



                        switch (format) {
                            case "mp4":
                                console.log("encoding: " + quality + " format: " + format)
                                //Do mp4 stuff here!
                                var cmd = ffmpeg(fsPath)
                                    .output(tmp_dir + "/" + quality + ".mp4")
                                    .audioCodec('libmp3lame')
                                    .videoCodec('libx264')
                                    .size(qualityWxH)
                                    .outputOptions(["-preset slow"]).on('progress', progressMonitor);
                                var val = await this.ffmpegPromise(cmd)
                                results["mp4"].push(val.cmd._currentOutput.target);
                                

                            case "hls":
                            //Do HLS stuff here!

                        }
                        resolve(results)
                        //Clean up code here!
                    }
                }
            }
            run();
        });
    }
    testHlsUpload() {
        return new Promise((resolve, reject) => {
            async function run() {
                try {
                    ffmpeg.ffprobe('a.mp4', function (err, metadata) {
                        var duration = Math.round(metadata.format.duration);
                        var steps;
                        var max;
                        if (duration < 100) {
                            max = duration
                            steps = 1;
                        } else {
                            max = 100;
                            steps = duration / 100;
                        }
                    });
                    ffmpeg('a.mp4')
                        .screenshots({
                            count: 100,
                            filename: 'sprite_%d.png',
                            folder: "../folder",
                            size: '210x118'
                        })
                    ffmpeg('a.mp4')
                        .output('../outputfile.m3u8').outputOptions([
                            '-profile:v baseline',
                            '-level 3.0',
                            '-s 640x360',          // 640px width, 360px height output video dimensions
                            '-start_number 0',     // start the first .ts segment at index 0
                            '-hls_time 10',        // 10 second segment duration
                            '-hls_list_size 0',    // Maxmimum number of playlist entries (0 means all entries/infinite)
                            '-f hls'
                        ]).run();
                    //ffmpeg('blah.mp4').outputOptions(["-s 320:180", "-c:v libx264" -preset fast -c:a aac output.mp4 -hide_banner
                    //])


                    resolve("test")
                } catch (err) {
                    console.log(err)
                    reject(err)
                }
            }
            run()
        });
    }
    generateSprite(fsPath, token) {
        //Do stuff to generate sprite ETC.
        return new Promise((resolve, reject) => {
            var self = this.self; //Local access
            var dir = tmp.dirSync().name; //Generate temp directory
            var uploadsInProgress = this.uploadsInProgress; //Local access


            const amount = 100;
            ffmpeg(fsPath).screenshots({
                count: amount,
                filename: '%d.png',
                folder: dir,
                size: '210x118'
            }).on('end', (stdout, stderr) => {



                var list = [];
                for (var y = 0; y < amount; y++) {
                    list.push(dir + "/" + "1_" + (y + 1) + ".png"); //Add temp directory to parent of file.
                }
                console.log(list)
                //Avoid a tiny bit of callback hell
                var run = async () => {
                    var img = await mergImg(list, { direction: true }) //Create sprite.png

                    var sprite = dir + "/" + "sprite.png";
                    img.write(sprite, () => {
                        self.ipfs.addFromFs(sprite).then((results) => {
                            var vid = uploadsInProgress[token];

                            var dag = { name: "sprite.png", size: results[0].size, cid: results[0].hash };
                            self.ipfs.object.patch.addLink(vid.base, dag).then(
                                (value) => {
                                    uploadsInProgress[token].base = value;
                                    resolve({ hash: value, token: token });
                                })
                        });
                    })
                }
                run();
            })
        });
    }
    start() {
        if (this.pid !== null | this.pid !== undefined) throw "Uploader is currently running"
        //this.pid = setInterval(this.processUpload, 2500);
    }
    stop() {
        if (this.pid === undefined) throw "Uploader is not running."
        clearInterval(this.pid)
        this.pid = null;
    }
    createNewUpload() {
        return new Promise((resolve, reject) => {
            try {
                this.self.ipfs.object.new("unixfs-dir").then((base) => {
                    var uuid = uuidv4();
                    this.uploadsInProgress[uuid] = new VideoUpload(base);
                    resolve(uuid);
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    uploadThumbnailFromFs(fsPath, token) {
        //Do some checking if it really is an image.

        return new Promise((resolve, reject) => {
            try {
                this.self.ipfs.addFromFs(fsPath).then((value) => {
                    var multinode = value[0];
                    var vid = this.uploadsInProgress[token];
                    var dag = { name: "thumbnail", size: multinode.size, cid: multinode.hash };
                    this.self.ipfs.object.patch.addLink(vid, dag).then(
                        (value) => {
                            this.uploadsInProgress[token].base = value;
                            resolve({ hash: value, token: token });
                        })
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}
exports = module.exports = uploader;