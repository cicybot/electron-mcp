const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const archiver = require("archiver");

/* ================= util ================= */

async function copyDirSafe(src, dst) {
    await fse.ensureDir(dst);

    const items = await fse.readdir(src, { withFileTypes: true });

    for (const item of items) {
        const srcPath = path.join(src, item.name);
        const dstPath = path.join(dst, item.name);

        // 明确跳过高风险目录
        if (
            ["network", "gpuCache", "shadercache"].includes(item.name.toLowerCase())
        ) {
            continue;
        }

        try {
            if (item.isDirectory()) {
                await copyDirSafe(srcPath, dstPath);
            } else if (item.isFile()) {
                await fse.copyFile(srcPath, dstPath);
            }
        } catch (err) {
            if (err.code === "EBUSY" || err.code === "EPERM") {
                console.warn("⚠️ Skipped locked:", srcPath);
                continue;
            }
            throw err;
        }
    }
}

function zipDirectory(sourceDir, outZip) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outZip);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", resolve);
        archive.on("error", reject);

        archive.pipe(output);
        archive.directory(sourceDir, false);
        archive.finalize();
    });
}

async function moveAcrossDevice(src, dst) {
    await fse.copyFile(src, dst);
    await fse.remove(src);
}

/* ================= backup ================= */

async function backupToZ({
                             sourceDir,
                             tmpCopyDir,
                             tmpZip,
                             dstZip
                         }) {
    try {
        if (!fs.existsSync(sourceDir)) {
            console.warn(`⚠️ Source not found: ${sourceDir}`);
            return false;
        }

        console.log(`📦 Backing up: ${sourceDir}`);

        await fse.remove(tmpCopyDir);
        await copyDirSafe(sourceDir, tmpCopyDir);
        console.log(`📁 Copied to ${tmpCopyDir}`);

        await fse.remove(tmpZip);
        await zipDirectory(tmpCopyDir, tmpZip);
        console.log(`🗜 Created ${tmpZip}`);

        await fse.remove(dstZip);
        await moveAcrossDevice(tmpZip, dstZip);
        console.log(`🚚 Moved to ${dstZip}`);

        await fse.remove(tmpCopyDir);
        return true;
    } catch (err) {
        console.error("❌ Backup failed:", err.message);
        return false;
    }
}

/* ================= run ================= */

(async () => {
    await backupToZ({
        sourceDir: "C:/Users/runneradmin/AppData/Local/Google/Chrome/User Data",
        tmpCopyDir: "C:/chrome-copy",
        tmpZip: "C:/chrome-win.zip",
        dstZip: "Z:/chrome-win.zip",
    });

    await backupToZ({
        sourceDir: "C:/Users/runneradmin/AppData/Roaming/Electron",
        tmpCopyDir: "C:/electron-copy",
        tmpZip: "C:/electron-win.zip",
        dstZip: "Z:/electron-win.zip",
    });
})();
