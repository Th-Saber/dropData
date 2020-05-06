<template>
  <div>
    <label for="uploadFile" class="uploadLabel">
      导入表格
      <input
        id="uploadFile"
        type="file"
        style="display:none"
        @change="importfxx(this)"
        accept=".csv"
      />
    </label>
  </div>
</template>

<script>

export default {
  methods: {
    importfxx(obj) {
      let _this = this;
      let inputDOM = this.$refs.inputer;
      // 通过DOM取文件数据
      this.file = event.currentTarget.files[0];
      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;
      console.log(this.file);
      //   var reader = new FileReader();

      //if (!FileReader.prototype.readAsBinaryString) {
      //   FileReader.prototype.readAsBinaryString = function(f) {
      //     var binary = "";
      //     var rABS = false; //是否将文件读取为二进制字符串
      //     var pt = this;
      //     var wb; //读取完成的数据
      //     var outdata;
      //     var reader = new FileReader();
      //     // reader.onload = function(e) {
      //     //   var bytes = new Uint8Array(reader.result);
      //     //   var length = bytes.byteLength;
      //     //   for (var i = 0; i < length; i++) {
      //     //     binary += String.fromCharCode(bytes[i]);
      //     //   }
      //     //   var XLSX = require("xlsx");
      //     //   if (rABS) {
      //     //     wb = XLSX.read(btoa(fixdata(binary)), {
      //     //       //手动转化
      //     //       type: "base64"
      //     //     });
      //     //   } else {
      //     //     wb = XLSX.read(binary, {
      //     //       type: "binary"
      //     //     });
      //     //   }
      //     //   outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); //outdata就是你想要的东西
      //     //   this.da = [...outdata];
      //     //   let arr = [];
      //     //   this.da.map(v => {
      //     //     let obj = {};
      //     //     obj["SN"] = v["SN"];
      //     //     obj["DID"] = v["DID"];
      //     //     obj["KEY"] = v["KEY"];
      //     //     obj["DT"] = v["DT"];
      //     //     obj["VID"] = v["VID"];
      //     //     arr.push(obj);
      //     //   });
      //     //   console.log("arr", arr);
      //     //   let para = {
      //     //     //withList: JSON.stringify(this.da)
      //     //     withList: arr
      //     //   };
      //     //   _this.$message({
      //     //     message: "请耐心等待导入成功",
      //     //     type: "success"
      //     //   });
      //     //   console.log("para", f);
      //     //   //   withImport(para).then(res => {
      //     //   //     window.location.reload();
      //     //   //   });
      //     // };
      //     reader.readAsArrayBuffer(f);
      //   };
    //   if (rABS) {
    //     reader.readAsArrayBuffer(f);
    //   } else {
    //     reader.readAsBinaryString(f);
    //   }
    }
  }
};
</script>

<style lang="less" scoped>
.uploadLabel {
  display: block;
}
</style>