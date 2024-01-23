import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../context/AuthProvider";
import "./style.css";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
export function CreateRMA({ handleRMA }) {
  const { productData, VisuallyHiddenInput, labelStyle , checkAndRefresh } =
    useContext(AuthContext);

  const [isChecked, setIsChecked] = useState(false);
  const [confirmStatus, setconfirmStatus] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [confirmEditAddress, setConfirmEditAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    address2: "",
    city: "",
    postcode: "",
    country: "",
  });
  const [reasonReturn, setReasonReturn] = useState("");
  const reasonTextFieldRef = useRef(null);

  //Change New Address
  const handleNewAddress = (e) => {
    const { id, value } = e.target;
    setNewAddress({
      ...newAddress,
      [id]: value,
    });
  };

  //Click Edit Address to display Confirm Edit or Not
  const handleEditAddress = () => {
    setConfirmEditAddress(true);
  };

  //Cancel Confirm Edit Address
  const handleCancelEditAddress = () => {
    setConfirmEditAddress(false);
  };

  //Confirm Edit Address
  const handleConfirmEditAddress = () => {
    setEditAddress(true);
    setConfirmEditAddress(false);
  };

  //Check the Value got insert or not
  const handleconfirmStatus = (confirm) => {
    if (editAddress) {
      if (
        !newAddress.address ||
        !newAddress.address2 ||
        !newAddress.city ||
        !newAddress.postcode ||
        !newAddress.country
      ) {
        alert("Please full in the Address Fields");
        return;
      }
    }

    if (!reasonReturn) {
      alert("Please full in all required Fields");
      return;
    }

    if (!imageFile && !imageFile2 && !videoFile) {
      alert("Please Insert One of File");
      return;
    } else {
      setconfirmStatus(confirm === "created" ? true : false);
    }
  };

  //After Submit RMA , Ask the Details Confirm
  const handleDoubleConfirm = async() => {
    setconfirmStatus(false);
    handleRMA("created");
    await createRMA();

    if (editAddress) {
      await updateAddress();
    }
  };

  //Update New Address
  const updateAddress = async() => {
    const token = await checkAndRefresh();
    axios
      .put("http://localhost:3001/updateAddress", {
        serialNum: productData.serialNum,
        address: newAddress.address,
        address2: newAddress.address2,
        city: newAddress.city,
        postcode: newAddress.postcode,
        country: newAddress.country,
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        console.log("Sending Success");
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  //Create A RMA
  const createRMA = async () => {
    const token = await checkAndRefresh();
    const formData = new FormData();
    formData.append("reason", reasonReturn);
    formData.append("serialNum", productData.serialNum);
    formData.append("imagefile", imageFile);
    formData.append("videofile", videoFile);
    formData.append("imagefile2", imageFile2);

    axios
      .post("http://localhost:3001/createRMA", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
      })
      .then(() => {
        console.log("Sending Success");
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  };

  //Image One
  const handleImageChange = (event) => {
    const image = event.target.files[0];
    setImageFile(image);
  };

  //Image 2
  const handleImageChange2 = (event) => {
    const image = event.target.files[0];
    setImageFile2(image);
  };

  //Video
  const handleVideoChange = (event) => {
    const video = event.target.files[0];
    setVideoFile(video);
  };

  //Open Image 
  const openImageInNewTab = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      window.open(imageUrl);
    }
  };
//Open Video
  const openVideoInNewTab = () => {
    if (videoFile) {
      const videoUrl = URL.createObjectURL(videoFile);
      window.open(videoUrl);
    }
  };

  //Tick the CheckBox
  const handleCheckBoxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  //Focus on Reason
  useEffect(() => {
    if (reasonTextFieldRef.current) {
      reasonTextFieldRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="overlay">
        <div className="overlay-content">
          <div className="insertRMA">
            <div className="rmaInformation">
              <div>
                <h2>Product Information</h2>
              </div>
              <div>
                <b>Selected Product for Return:</b>
              </div>
              <div>Serial Number : {productData.serialNum}</div>
              <div>Product Name :{productData.productname}</div>
              <div>Reason Of Return :</div>
              <div>
                <TextField
                  id="outlined-multiline-static"
                  label="Reason"
                  size="small"
                  multiline
                  rows={2}
                  style={{ width: "40%" }}
                  onChange={(e) => setReasonReturn(e.target.value)}
                  inputRef={reasonTextFieldRef}
                  inputProps={{ maxLength: 45 }}
                  required
                />
              </div>

              <div>
                <b>Shipping Address :</b>
                <div style={{ paddingLeft: "10px" }}>
  
              {/* {If Edit Address Will display TextField} */}
                  {!editAddress ? (
                    <div>
                      <div>{productData.address}</div>
                      <div>{productData.address2}</div>
                      <div>
                        {productData.city},{productData.postcode},
                        {productData.country}
                      </div>
                      <div>
                        <div style={{ paddingTop: "10px", textAlign: "right" }}>
                          <Button
                            onClick={handleEditAddress}
                            variant="contained"
                            size="small"
                          >
                            Edit
                          </Button>{" "}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <TextField
                          label="Address"
                          id="address"
                          size="small"
                          type="address"
                          style={{ width: "40ch" }}
                          onChange={handleNewAddress}
                          required
                        />
                      </div>
                      <div style={{ paddingTop: "10px" }}>
                        <TextField
                          label="Address 2"
                          id="address2"
                          size="small"
                          type="address"
                          style={{ width: "40ch" }}
                          onChange={handleNewAddress}
                          required
                        />
                      </div>
                      <div style={{ paddingTop: "10px" }}>
                        <TextField
                          label="City"
                          id="city"
                          size="small"
                          type="address"
                          style={{ width: "40ch" }}
                          onChange={handleNewAddress}
                          required
                        />
                      </div>
                      <div style={{ paddingTop: "10px" }}>
                        <TextField
                          label="Postal Code"
                          id="postcode"
                          size="small"
                          type="text"
                          style={{ width: "40ch" }}
                          onChange={handleNewAddress}
                          required
                        />
                      </div>
                      <div style={{ paddingTop: "10px" }}>
                        <TextField
                          label="Country"
                          id="country"
                          size="small"
                          type="text"
                          style={{ width: "40ch" }}
                          onChange={handleNewAddress}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <b>
                  *Kindly confirm whether the specified address <br />
                  is the correct location for shipping the items*
                </b>
              </div>
              <div>
                Upload Image or Video to show the item's condition for
                evaluation
              </div>
              <div>
                <Button
                  component="label"
                  variant="contained"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  style={{ marginLeft: "10px" }}
                >
                  Select Image file
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleImageChange}
                    name="imagefile"
                  />
                </Button>
              </div>
              {/* {If Image File Selected Display the File Name} */}
              {imageFile && (
                <div style={{ display: "flex" }}>
                  <div>
                    <p>
                      Selected file:
                      <a
                        href="#"
                        onClick={() => openImageInNewTab(imageFile)}
                        style={{ marginLeft: "5px" }}
                      >
                        {imageFile.name}
                      </a>
                    </p>
                  </div>
                </div>
              )}
               {/* {If Image One File Selected will give one more Button to Upload} */}
              {imageFile ? (
                <div>
                  <div>
                    If You Need To Upload <br /> Second Image (Not Required) :{" "}
                  </div>
                  <Button
                    component="label"
                    variant="contained"
                    size="small"
                    startIcon={<CloudUploadIcon />}
                    style={{ marginLeft: "10px", height: "32px" }}
                  >
                    Select Image file
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleImageChange2}
                      name="imagefile"
                    />
                  </Button>
                </div>
              ) : null}
              {/* {If Image File 2 Selected Display the File Name} */}
              {imageFile2 && (
                <div style={{ display: "flex" }}>
                  <div>
                    <p>
                      Selected file:
                      <a
                        href="#"
                        onClick={() => openImageInNewTab(imageFile2)}
                        style={{ marginLeft: "5px" }}
                      >
                        {imageFile2.name}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <div>
                <Button
                  component="label"
                  variant="contained"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  style={{ marginLeft: "10px" }}
                >
                  Select Video file
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleVideoChange}
                    name="videofile"
                  />
                </Button>
              </div>
              {/* {If Video File Selected Display the File Name} */}
              {videoFile && (
                <div style={{ display: "flex" }}>
                  <div>
                    <p>
                      Selected file:
                      <a
                        href="#"
                        onClick={openVideoInNewTab}
                        style={{ marginLeft: "5px" }}
                      >
                        {videoFile.name}
                      </a>
                    </p>
                  </div>
                </div>
              )}
              <div>
                <Button
                  variant="contained"
                  onClick={() => {
                    handleconfirmStatus("created");
                  }}
                >
                  Submit
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    handleRMA("cancel");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
            {/* {After Submit Display Confirm Status} */}
            {confirmStatus ? (
              <div className="overlay2">
                <div className="overlay2-content">
                  <div
                    style={{
                      border: "1px solid black",
                      width: 700,
                      padding: 30,
                      fontFamily: "Arial, sans-serif",
                      backgroundColor: "#f8f8f8",
                      borderRadius: 10,
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                      margin: "auto",
                    }}
                  >
                    <h2>Check Your Information</h2>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "center",
                          border: "1px solid black",
                          width: 640,
                          padding: 30,
                        }}
                      >
                        <table>
                          <tbody>
                            <tr>
                              <td colSpan="3">
                                <h3>Contact Information</h3>
                              </td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>Customer Name</td>
                              <td>:</td>
                              <td>{productData.name}</td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>Phone</td>
                              <td>:</td>
                              <td>{productData.phone}</td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>Email</td>
                              <td>:</td>
                              <td>{productData.email}</td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>Shipping Address</td>
                              <td>:</td>
                              <td>
                                {editAddress ? (
                                  <div>
                                    {newAddress.address}
                                    <br />
                                    {newAddress.address2}
                                    <br />
                                    {newAddress.postcode}, {newAddress.city},{" "}
                                    {newAddress.country}
                                  </div>
                                ) : (
                                  <div>
                                    {productData.address}
                                    <br />
                                    {productData.address2}
                                    <br />
                                    {productData.postcode}, {productData.city},{" "}
                                    {productData.country}
                                  </div>
                                )}
                              </td>
                            </tr>

                            <tr>
                              <td colSpan="3">
                                <h3>Product Information</h3>
                              </td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>Serial Number</td>
                              <td>:</td>
                              <td>{productData.serialNum}</td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>Product Name</td>
                              <td>:</td>
                              <td>{productData.productname}</td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>Reason of Return</td>
                              <td>:</td>
                              <td>{reasonReturn}</td>
                            </tr>
                            <tr>
                              <td style={labelStyle}>Supporting Information</td>
                              <td>:</td>
                              <td>
                                <div>
                                  {imageFile ? (
                                    <div>
                                      <a
                                        href="#"
                                        onClick={() =>
                                          openImageInNewTab(imageFile)
                                        }
                                        style={{ marginLeft: "5px" }}
                                      >
                                        {imageFile.name}
                                      </a>
                                    </div>
                                  ) : null}
                                  {imageFile2 ? (
                                    <div>
                                      <a
                                        href="#"
                                        onClick={() =>
                                          openImageInNewTab(imageFile2)
                                        }
                                        style={{ marginLeft: "5px" }}
                                      >
                                        {imageFile2.name}
                                      </a>
                                    </div>
                                  ) : null}
                                  {videoFile ? (
                                    <div>
                                      <a
                                        href="#"
                                        onClick={openVideoInNewTab}
                                        style={{ marginLeft: "5px" }}
                                      >
                                        {videoFile.name}
                                      </a>
                                    </div>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      value="agreed"
                      onChange={handleCheckBoxChange}
                      style={{ margin: "10px 0" }}
                    />
                    <label htmlFor="agreeTerms" style={{ fontSize: 14 }}>
                      Kindly ensure the accuracy of the information above. Once
                      confirmed, modifications cannot be made.
                    </label>

                    <div style={{ marginTop: 10 }}>
                      <Button
                        variant="contained"
                        disabled={!isChecked}
                        onClick={() => {
                          handleDoubleConfirm();
                        }}
                        style={{ marginRight: 10 }}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleconfirmStatus("cancel");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Dialog open={confirmEditAddress} onClose={handleEditAddress}>
        <DialogTitle>Edit Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change your address?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEditAddress} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmEditAddress} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
