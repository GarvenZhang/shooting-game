const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')

const {
	ak, sk, bucket
} = require('../config').CDN

const mac = new qiniu.auth.digest.Mac(ak, sk)
const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z2
config.useHttpsDomain = true
config.useCdnDomain = true

const upload = (key, file) => {

	const opts = {
		scope: bucket + ':' + key
	}
	const formUploader = new qiniu.form_up.FormUploader(config)
	const putExtra = new qiniu.form_up.PutExtra()
	const putPolicy = new qiniu.rs.PutPolicy(opts)
	const uploadToken = putPolicy.uploadToken(mac)

	return new Promise((resolve, reject) => {
		formUploader.putFile(uploadToken, key, file, putExtra, function (respErr,
			respBody, respInfo) {
			if (respErr) {
				throw respErr
			}
			if (respInfo.statusCode == 200) {
				console.log(respBody)
			} else {
				console.log(respInfo.statusCode)
				console.log(respBody)
			}
		})
	})
}

const distPath = path.join(__dirname, '../dist')

const uploadAll = (dir, prefix) => {
	console.log(dir)
	const files = fs.readdirSync(dir)

	files.forEach(file => {
		
		const filePath = path.join(dir, file)
		const key = prefix ? `${prefix}/${file}` : file

		if (fs.lstatSync(filePath).isDirectory()) {
			return uploadAll(filePath, key)
		}

		upload(key, filePath)
		.then(resp => {
			console.log(resp)
		})
		.catch(err => {
			console.error(err)
		})
	})

}

uploadAll(distPath)
