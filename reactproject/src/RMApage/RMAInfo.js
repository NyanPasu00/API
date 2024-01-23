import React, { useContext, useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import AuthContext from "../context/AuthProvider";

export default function RMAInfo({ handleInfo }) {
  const { allRmaInfo, labelStyle } = useContext(AuthContext);

  const [copySuccess, setCopySuccess] = useState(false);
  const [waybill, setWaybill] = useState("");
  const [courier, setCourier] = useState("");
  const handleCopy = () => {
    const addressText = `39-3, Jalan SP 2/2, Taman Serdang Perdana, 43300 Seri Kembangan, Selangor, Malaysia`;
    navigator.clipboard
      .writeText(addressText)
      .then(() => setCopySuccess(true))
      .catch((err) => console.error("Failed to copy:", err));
  };

  //Update The Waybill
  const handleWaybill = () => {
    axios
      .put("http://localhost:3001/updateWaybill", {
        waybill: waybill,
        courier: courier,
        serialNum: allRmaInfo.serialNum,
      })
      .then(() => {
        console.log("Success Update WayBill");
      })
      .catch((error) => {
        console.error("Error Getting data:", error);
      });
  };
  return (
    <div className="overlay">
      <div className="overlay-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#E0FFFF",
            padding: "20px",
            height: "100%",
          }}
        >
          <div
            style={{
              flex: 1,
              marginRight: "20px",
              border: "3px solid black",
              borderRadius: "5px",
              padding: "15px",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <h2>RMA Info</h2>
            <table>
              <tbody>
                <tr>
                  <td style={labelStyle}>Name</td>
                  <td>:</td>
                  <td>{allRmaInfo.name}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Phone</td>
                  <td>:</td>
                  <td>{allRmaInfo.phone}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>Email</td>
                  <td>:</td>
                  <td>{allRmaInfo.email}</td>
                </tr>

                <tr>
                  <td style={labelStyle}>Address</td>
                  <td>:</td>
                  <td>
                    <div style={{ paddingTop: "10px" }}>
                      <div>{allRmaInfo.address}</div>
                      <div>{allRmaInfo.address2}</div>
                      <div>
                        {allRmaInfo.city}, {allRmaInfo.postcode},{" "}
                        {allRmaInfo.country}
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style={labelStyle}>Serial Number</td>
                  <td>:</td>
                  <td>{allRmaInfo.serialNum}</td>
                </tr>

                <tr>
                  <td style={labelStyle}>Product Name</td>
                  <td>:</td>
                  <td>{allRmaInfo.productname}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>K Plus</td>
                  <td>:</td>
                  <td>{allRmaInfo.kplus ? "Yes" : "No"}</td>
                </tr>

                <tr>
                  <td style={labelStyle}>RMA ID</td>
                  <td>:</td>
                  <td>
                    {allRmaInfo.rma_id !== null &&
                    allRmaInfo.rma_id !== undefined
                      ? `RMA${String(allRmaInfo.rma_id).padStart(4, "0")}`
                      : "-"}
                  </td>
                </tr>
                <tr>
                  <td style={labelStyle}>Reason </td>
                  <td>:</td>
                  <td>{allRmaInfo.reason}</td>
                </tr>
                <tr>
                  <td style={labelStyle}>
                    Supporting <br /> Image And Video
                  </td>
                  <td>:</td>
                  <td>
                    {allRmaInfo.receiptImage ? (
                      <div>
                        <a
                          href={`http://localhost:3001/${allRmaInfo.receiptImage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Receipt
                        </a>
                      </div>
                    ) : null}
                    {allRmaInfo.productImage ? (
                      <div>
                        <a
                          href={`http://localhost:3001/${allRmaInfo.productImage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Product Image
                        </a>
                      </div>
                    ) : null}
                    {allRmaInfo.productImage2 ? (
                      <div>
                        <a
                          href={`http://localhost:3001/${allRmaInfo.productImage2}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Product Image2
                        </a>
                      </div>
                    ) : null}
                    {allRmaInfo.productVideo ? (
                      <div>
                        <a
                          href={`http://localhost:3001/${allRmaInfo.productVideo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Product Video
                        </a>
                      </div>
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </table>
            <Button
              variant="contained"
              style={{ width: "20px" }}
              onClick={() => handleInfo("close")}
            >
              Close
            </Button>
          </div>

          {allRmaInfo.rmaStatus === "Approve" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                marginRight: "20px",
                border: "3px solid black",
                borderRadius: "5px",
                padding: "15px",
              }}
            >
              <h2>Your RMA has been Approved!</h2>
              <div>
                We have reviewed your RMA request and it has been approved.
                Please proceed with the return process by following the
                instructions below.
              </div>
              <div>
                <b>Return Instruction</b>
              </div>
              <div>1. Packaging : Securely pack the item</div>
              <div>
                2. RMA Number : Include the RMA number inside the package
              </div>
              <div>
                3. Shipping Address : Ship the package to the following address
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <b>Shipping Address:</b>
                  <div>39-3, Jalan SP 2/2,</div>
                  <div>Taman Serdang Perdana,</div>
                  <div>43300 Seri Kembangan, Selangor , Malaysia</div>
                </div>
                <Button
                  variant="contained"
                  onClick={handleCopy}
                  style={{ width: "10px", height: "30px" }}
                >
                  Copy
                </Button>
                {copySuccess && <div>Copy Success</div>}
              </div>
              <div>Please Insert Your WayBill Tracking Number</div>
              <div>
                <TextField
                  label="Waybill"
                  id="waybill"
                  size="small"
                  type="text"
                  style={{
                    width: "40ch",
                    textAlign: "center",
                  }}
                  onChange={(e) => setWaybill(e.target.value)}
                  required
                />
              </div>
              <div>
                <TextField
                  label="Courier Provider"
                  id="courier"
                  size="small"
                  style={{
                    width: "40ch",
                  }}
                  onChange={(e) => setCourier(e.target.value)}
                  required
                ></TextField>
              </div>
              <Button
                variant="contained"
                style={{ width: "20px" }}
                onClick={handleWaybill}
              >
                Submit
              </Button>
            </div>
          )}

          {allRmaInfo.rmaStatus === "Reject" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                marginRight: "20px",
                border: "3px solid black",
                borderRadius: "5px",
                padding: "15px",
              }}
            >
              <h2>Your RMA has been Rejected</h2>
              <h3>Reason: Item Does Not Meet Return Criteria</h3>
              <div>
                We regret to inform you that your RMA request has been rejected
                because the item does not meet our return criteria.
              </div>
              <div>
                <b>Contact Support:</b>
              </div>
              <div>
                For further assistance, please contact us at{" "}
                <a href="mailto:eclipse@company.com">eclipse@company.com</a> or
                call 1-800-XXX-XXXX.
              </div>
            </div>
          )}
          {allRmaInfo.rmaStatus === "Pending" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                marginRight: "20px",
                border: "3px solid black",
                borderRadius: "5px",
                padding: "15px",
              }}
            >
              <h2>
                Your RMA confirmation is currently under review. We appreciate
                your patience, and we will promptly notify you of any updates or
                decisions regarding your request.
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
