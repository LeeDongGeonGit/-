(function () {
    function camera() {
      return new Promise((resolve, reject) => {
        M.media.camera({
          path: '/media',
          mediaType: 'PHOTO',
          saveAlbum: true,
          callback: function (status, result, option) {
            if (status === 'SUCCESS') {
              resolve(result.fullpath);
            } else {
              reject();
            }
          },
        });
      });
    }
  
    function mediaPicker() {
      return new Promise((resolve, reject) => {
        M.media.picker({
          mode: 'SINGLE',
          media: 'PHOTO',
          column: 3,
          callback: function (status, result) {
            if (status === 'SUCCESS') {
              resolve(result.fullpath);
            } else {
              reject();
            }
          },
        });
      });
    }
  
    function img2base64(imagePath) {
      return new Promise((resolve, reject) => {
        M.file.read({
          path: imagePath,
          encoding: 'BASE64',
          indicator: true,
          callback: function (status, result) {
            if (status === 'SUCCESS') {
              resolve(result.data);
            } else {
              reject();
            }
          },
        });
      });
    }
  
    function fileUpload({ url, progress, payload }) {
      return new Promise((resolve, reject) => {
        M.net.http.upload({
          url: url,
          header: {},
          params: {},
          body: payload,
          encoding: 'UTF-8',
          finish: function (status, header, body, setting) {
            resolve({ status, header, body, setting });
          },
          progress: function (total, current) {
            progress(total, current);
          },
        });
      });
    }
  
    function appendBodyImage(src) {
      const $preview = document.getElementById('preview');
      if ($preview) $preview.remove();
  
      const $img = document.createElement('img');
      $img.setAttribute('id', 'preview');
      $img.setAttribute('src', src);
      $img.setAttribute('style', 'width: 200px;');
  
      document.body.appendChild($img);
    }
  
    // onload event
    window.onload = () => {
      let _imagePath;
      const $camera = document.getElementById('btn-camera');
      const $picker = document.getElementById('btn-picker');
      const $upload = document.getElementById('btn-upload');
  
      $camera.addEventListener('click', () => {
        // Camera 버튼 클릭시
        camera()
          .then((imagePath) => {
            _imagePath = imagePath;
            return img2base64(imagePath);
          })
          .then((base64) => {
            appendBodyImage('data:image/png;base64,' + base64);
          })
          .catch((e) => {
            console.error(e);
            _imagePath = undefined;
            M.pop.alert('카메라 촬영 실패');
          });
      });
  
      $picker.addEventListener('click', () => {
        // Picker 버튼 클릭시
        mediaPicker()
          .then((imagePath) => {
            _imagePath = imagePath;
            return img2base64(imagePath);
          })
          .then((base64) => {
            appendBodyImage('data:image/png;base64,' + base64);
          })
          .catch((e) => {
            console.error(e);
            _imagePath = undefined;
            M.pop.alert('이미지 가져오기 실패');
          });
      });
  
      $upload.addEventListener('click', () => {
        // upload 버튼 클릭시
        if (!_imagePath) return M.pop.alert('이미지를 선택해주세요.');
        fileUpload({
          url: 'http://192.168.0.16:3000/file/upload',
          progress: (...args) => {
            console.log(...args);
          },
          payload: [{ name: 'file', content: _imagePath, type: 'FILE' }],
        }).then((res) => {
          if (res.status === '200') {
            // 200 code
            const body = JSON.parse(res.body);
            appendBodyImage(body.fullpath);
            M.pop.instance('업로드 성공');
          } else {
            M.pop.instance('업로드 실패');
          }
        });
      });
    };
  })();