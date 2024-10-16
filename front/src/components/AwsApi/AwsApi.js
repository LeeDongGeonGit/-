import AWS from 'aws-sdk';
const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_S3_ACCESS_KEY, // IAM 사용자 엑세스 키 변경
    secretAccessKey: process.env.REACT_APP_AWS_S3_SECRET_KEY, // IAM 엑세스 시크릿키 변경
    region: 'ap-northeast-2', // 리전 변경
  });

  export const s3HandleUpload = (selectedImg, name,flolderName) => {
    return new Promise((resolve, reject) => {
      if (!selectedImg) {
        reject(new Error('No selected image'));
      }
      // 업로드할 파일 정보 설정
      const uploadParams = {
        Bucket: 'ourcaptain',  // 버킷 이름 변경
        Key: `${flolderName}/${name}`, // S3에 저장될 경로와 파일명
        Body: selectedImg,
      };
      // S3에 파일 업로드
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          console.error('Error uploading file:', err);
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  };
 export const s3DeleteImg =async(url,flolderName)=>{
    try{
    const key = url.substring(url.lastIndexOf('/') + 1);
    console.log(url);
    console.log(key);
   await s3.deleteObject({
        Bucket: 'ourcaptain',
        Key: `${flolderName}/${key}`,
      }
    ).promise();}
    catch(err){
        console.log(err);
        throw err;
      }
  }