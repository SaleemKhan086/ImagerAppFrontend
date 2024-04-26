import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";


function ImageUploader() {
    const API_URL = "http://localhost:8080/api/v1/s3";

    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [messageStatus, setMessageStatus] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedSrc, setUploadedSrc] = useState("");

    const refFunc = useRef(() => {});

    useEffect(() => {
        getFiles();
    },[]);

    const getFiles = () => {
        axios.get(API_URL).then(response => {
            setFiles(response.data); 
        }).catch(error => console.log(error));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if(file.type === "image/png" || file.type === "image/jpeg"){
            setSelectedFile(file);
        }else{
            alert("File not an image");
            setSelectedFile(null);
        }
    };

    const formSubmit = (event) => {
        event.preventDefault();
        if(selectedFile){
            uploadImageToServer();
        }else{
            alert("select image first");
        }
    };

    const resetHandler = () => {
        refFunc.current.value = "";
        setSelectedFile(null);
        setMessageStatus(false);
    }

    const uploadImageToServer = ()=>{
        const data = new FormData();
        data.append("file", selectedFile);
        setUploading(true);
        axios.post(API_URL, data).then(
            response => {
                console.log(response);
                setUploadedSrc(response.data);
                setMessageStatus(true);
                getFiles();
            }
        ).catch(
            err => {
                console.log(err);
            }
        ).finally(
            ()=> {
                console.log("finally");
                setUploading(false);
            }
        );
    }

    return (<div className="main flex flex-col items-center justify-center">
        <div className="rounded card w-full border shadow m-4 p-4">
            <h1>Image uploader</h1>
            <div className="form-container">
                <form action="" onSubmit={formSubmit}>
                    <div className="field-container flex flex-col gap-y-2">
                        <label htmlFor="fileInput">Select Image</label>
                        <input ref={refFunc} type="file" id="fileInput" onChange={handleFileChange} />
                    </div>
                    <div className="field-container">
                        <button type="submit" className="px-3 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded">Upload File</button>
                        <button type="button" 
                        className="ml-2 px-3 py-2 bg-orange-700 hover:bg-orange-600 text-white rounded"
                        onClick={resetHandler}>
                            Clear
                        </button>
                    </div>
                </form>
            </div>
            {
                uploading && (<div className="p-3 text-center">
                    Uploading...
                </div>)
            }
            {
                messageStatus && <div className="uploaded-view">
                <img className="h-[300px] mx-auto mt-4 rounded shadow" src={uploadedSrc} alt=""></img>
            </div>
            }
        </div>

        {/* show images section */}

         <div className="mt-4 flex flex-wrap">
            {
                files.map(photo => 
                <img className="h-[200px] m-3 justify-center" src={photo} key={photo} />)
            }
         </div>

    </div>)
}

export default ImageUploader;
