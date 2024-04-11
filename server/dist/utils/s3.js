import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
require("dotenv").config();
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accesKey = process.env.ACCES_KEY;
const secretKey = process.env.SECRET_KEY;
const createRandomImageName = (name) => {
    return `${crypto.randomUUID()}-file-${name}`;
};
const s3 = new S3Client({
    credentials: {
        accessKeyId: accesKey,
        secretAccessKey: secretKey
    },
    region: bucketRegion
});
export const saveFileToS3 = async (file) => {
    const response = {
        success: false,
        message: "Failed",
        result: "",
        url: ""
    };
    try {
        const fileName = createRandomImageName(file?.originalName);
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: file?.buffer,
            ContentType: file?.mimetype
        };
        const command = new PutObjectCommand(params);
        const result = await s3.send(command);
        response.success = true,
            response.message = "Success";
        response.result = result;
        response.url = fileName;
        return response;
    }
    catch (err) {
        console.log({
            fileSaving: err.message
        });
        response.message = err.message;
        response.success = false;
        return response;
    }
};
export const getFromS3 = async (url) => {
    const response = {
        message: "",
        result: "",
        success: false,
        url: ""
    };
    try {
        const objectParams = {
            Bucket: bucketName,
            Key: url
        };
        const command = new GetObjectCommand(objectParams);
        const fileUrl = await getSignedUrl(s3, command);
        response.message = "Success";
        response.result = "";
        response.success = true,
            response.url = fileUrl;
        return response;
    }
    catch (err) {
        response.message = "Failed";
        response.success = false;
        return err.message;
    }
};
export const deleteFile = async (fileUrl) => {
    const response = {
        message: "",
        success: false,
        url: ""
    };
    try {
        const deleteParams = {
            Bucket: bucketName,
            Key: fileUrl,
        };
        const command = new DeleteObjectCommand(deleteParams);
        await s3.send(command);
        response.message = "Success";
        response.success = true;
        return response;
    }
    catch (err) {
        response.message = err.message;
        response.success = false;
        return response;
    }
};
