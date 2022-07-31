import React from "react";
import { useState, useRef } from "react";
import { mintNFT } from "../utils/interact.js";
import { create } from "ipfs-http-client";

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
});
export default function Minter(props) {
  const [status, setStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusURL, setStatusURL] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [uploadedData, setUploadedData] = useState(null);
  const [multiFileChecked, setMultiFileChecked] = useState(false);

  const { walletAddress, connectWalletPressed } = props;
  const fileUploadRef = useRef(null);

  // useEffect(() => {
  //   if (fileUploadRef.current !== null && multiFileChecked) {
  //     fileUploadRef.current.setAttribute("directory", "");
  //     fileUploadRef.current.setAttribute("multiple", "");
  //     fileUploadRef.current.setAttribute("webkitdirectory", "");
  //   } else {
  //     fileUploadRef.current.removeAttribute("directory");
  //     fileUploadRef.current.removeAttribute("multiple");
  //     fileUploadRef.current.removeAttribute("webkitdirectory");
  //   }
  // }, [multiFileChecked]);
  // const retrieveFile = (e) => {
  //   console.log(e);
  //   const data = e.target.files[0];
  //   const reader = new window.FileReader();
  //   if (data) {
  //     reader.readAsArrayBuffer(data);
  //     reader.onloadend = () => {
  //       const buffer = reader.result;
  //       setUploadedData(Buffer.from(buffer));
  //       console.log("Buffer data: ", Buffer.from(buffer));
  //     };
  //     e.preventDefault();
  //   }
  // };
  // const handleMultiFileCheckChange = () => {
  //   setMultiFileChecked(!multiFileChecked);
  // };
  // <div>
  // <h2>💾 Upload Your Data:</h2>
  // <div className="mb-3">
  //   <input
  //     type="checkbox"
  //     id="account"
  //     className="form-check-input mr-2 flex-shrink-0"
  //     checked={multiFileChecked}
  //     style={{ marginRight: "10px" }}
  //     onChange={handleMultiFileCheckChange}
  //   />
  //   <label>Uploading More Than One File?</label>
  // </div>
  // <input
  //   className="form-control form-control-lg"
  //   id="formFileLg"
  //   type="file"
  //   onChange={retrieveFile}
  //   ref={fileUploadRef}
  // />
  // </div>

  const onMintPressed = async () => {
    if (!walletAddress) {
      setStatus("You must connect a wallet first!");
      return;
    }
    getFileByTagAndSendToIPFS();
    const created = await client.add(uploadedData, {
      pin: true, // <-- this is the default
    });
    const ipfsUrl = `https://ipfs.infura.io/ipfs/${created.path}`;
    //make metadata
    const metadata = {
      name: name,
      url: ipfsUrl,
      description: description,
    };
    //setUrlArr((prev) => [...prev, ipfsUrl]); MULTI FILE UPLOAD?
    const { success, status } = await mintNFT(metadata);
    setStatus(status);
    if (success) {
      setName("");
      setDescription("");
      setURL(ipfsUrl);
      setStatusMessage(status.split("Block Scout:")[0]);
      setStatusURL(status.split("Block Scout:")[1].trim());
    }
  };

  async function getFileByTagAndSendToIPFS() {
    const img = document.getElementById("decent-data-image-tag");
    const blob = await loadXHR(img.src);
    const reader = new window.FileReader();
    if (blob) {
      reader.readAsArrayBuffer(blob);
      reader.onloadend = () => {
        const buffer = reader.result;
        setUploadedData(Buffer.from(buffer));
        console.log("Buffer data: ", Buffer.from(buffer));
      };
    }
  }

  function loadXHR(url) {
    return new Promise(function (resolve, reject) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.onerror = function () {
          reject("Network error.");
        };
        xhr.onload = function () {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject("Loading error:" + xhr.statusText);
          }
        };
        xhr.send();
      } catch (err) {
        reject(err.message);
      }
    });
  }

  const handleMultiFileCheckChange = () => {
    setMultiFileChecked(!multiFileChecked);
  };

  return (
    <section className="position-relative jarallax">
      <div className="position-relative zindex-4 pt-lg-3 pt-xl-5">
        <div className="container zindex-5 pt-5">
          <div className="row justify-content-center text-center pt-4 pb-sm-2 py-lg-5">
            <div className="col-md-4">
              <h1 className="mb-md-4">Mint an NFT</h1>
              <p className="fs-lg pb-2">
                Simply add your asset's link, name, and description, then press
                "Mint."
              </p>
            </div>
            <div className="col-xl-7 col-md-8 offset-xl-1">
              <button onClick={connectWalletPressed}>
                {walletAddress.length > 0 ? (
                  "Connected: " +
                  String(walletAddress).substring(0, 6) +
                  "..." +
                  String(walletAddress).substring(38)
                ) : (
                  <span>Connect Wallet</span>
                )}
              </button>
            </div>
            <div className="col-xl-7 col-md-8 offset-xl-1">
              <form className="needs-validation" noValidate>
                <div className="col-sm-12 mb-4">
                  <div className="col-sm-12 mb-4">
                    <h2>🤔 Give it a Name:</h2>
                    <input
                      type="text"
                      id="asset-name"
                      className="form-control form-control-lg"
                      onChange={(event) => setName(event.target.value)}
                      required
                      placeholder="e.g. car title"
                    />
                  </div>
                  <div className="col-12 mb-4">
                    <h2>📃 Give it a Description</h2>
                    <textarea
                      id="asset-description"
                      className="form-control form-control-lg"
                      onChange={(event) => setDescription(event.target.value)}
                      required
                      placeholder="Description.."
                    ></textarea>
                    <div className="invalid-feedback">
                      Please write your description
                    </div>
                  </div>
                </div>
              </form>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <button
                  type="submit"
                  onClick={onMintPressed}
                  className="btn btn-primary btn-lg shadow-primary mt-1 p-4"
                  style={{ minWidth: "175px" }}
                >
                  Mint
                </button>
                {statusMessage && statusURL ? (
                  <div>
                    <p className="mt-3 text-danger">{statusMessage}</p>
                    <a
                      id="status"
                      href={statusURL}
                      target="_blank"
                      className="text-danger"
                    >
                      {statusURL}
                    </a>
                  </div>
                ) : (
                  <p id="status" className="text-danger mt-3">
                    {status}
                  </p>
                )}
                {url ? (
                  <div>
                    <p className="mt-3 text-danger">Your IPFS Data CID:</p>
                    <a
                      id="status"
                      href={url}
                      target="_blank"
                      className="text-danger"
                    >
                      {url}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
