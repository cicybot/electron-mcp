const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const archiver = require("archiver");

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

/**
 * 安全 copy（遇到 EBUSY / EPERM 自动跳过）
 */
async function safeCopy(src, dest) {
    try {
        await fse.copy(src, dest, {
            dereference: true,
            preserveTimestamps: true,
            errorOnExist: false,
            filter: (item) => {
                const name = path.basename(item).toLowerCase();
                return ![
                    "cookies",
                    "cookies-journal",
                    "network",
                    "gpuCache".toLowerCase()
                ].includes(name);
            }
        });
    } catch (err) {
        if (err.code === "EBUSY" || err.code === "EPERM") {
            console.warn("⚠️ Skipped locked file:", src);
            return;
        }
        throw err;
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

async function backupToZ({
                             sourceDir,
                             tmpCopyDir,
                             tmpZip,
                             dstZip
                         }) {
    try {
        if (!fs.existsSync(sourceDir)) {
            console.warn(`⚠️ Source not found, skipped: ${sourceDir}`);
            return false;
        }

        console.log(`📦 Backing up: ${sourceDir}`);

        // 1️⃣ 清理 copy
        await fse.remove(tmpCopyDir);

        // 2️⃣ Copy（安全）
        await safeCopy(sourceDir, tmpCopyDir);
        console.log(`📁 Copied to ${tmpCopyDir}`);

        // 3️⃣ 删除旧 zip
        await fse.remove(tmpZip);

        // 4️⃣ Zip
        await zipDirectory(tmpCopyDir, tmpZip);
        console.log(`🗜 Created ${tmpZip}`);

        // 5️⃣ 删除 Z: 旧文件
        await fse.remove(dstZip);

        // 6️⃣ 跨盘移动（关键修复）
        await moveAcrossDevice(tmpZip, dstZip);
        console.log(`🚚 Moved to ${dstZip}`);

        // 7️⃣ 清理 copy
        await fse.remove(tmpCopyDir);

        return true;
    } catch (err) {
        console.error("❌ Backup failed:", err.message);
        return false;
    }
}

/* ============================= */

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
