import React, { Component, Profiler, useEffect, useState } from "react";
import {
  Button,
  InputGroup,
  FormControl,
  Form,
  Col,
  Row,
  Card,
  ToggleButton,
  ToggleButtonGroup,
} from "react-bootstrap";
import PayPal from "./paypal";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Stripe from "./stripe";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./table.css";

const PUBLIC_KEY =
  "pk_test_51JR4m9CMdg35S26EAT3K6nPEVlxPHubEwzlQ4c2VetzslZmjts2FNQKWxkwZAiQdIgA1kWbCbvmQBGWBrbRONn7a00BSJqSyYd";
const stripePromise = loadStripe(PUBLIC_KEY);

const buttonlist1 = ["Membership Fee", "Donation", "Sadaqah", "Zakat"];
const buttonlist2 = ["PayPal", "Stripe", "Zelle", "Venmo"];

function Payment({ addTextLog }) {
  const [profile, setProfile] = useState({
    PaymentReason: "",
    PaymentMethod: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    Amount: 10,
    Comments: "",
    Status: "Processing",
    Type: "Outgoing",
  });
  const [clientSecret, setClientSecret] = useState("");

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const getAllPayments = async () => {
      try {
        const res = await axios.get("/payments");
        setPayments(res.data);
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  const saveNewPayment = async (p) => {
    const res = await axios.post("/payments", p);
    const newpayments = [...payments, res.data];
    setPayments(newpayments);
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    saveNewPayment(profile);
  };

  return (
    <React.Fragment>
      <h2 className="ml-5 mt-3">New Payment</h2>
      <Form onSubmit={handleSubmit}>
        <div className="ml-3 mt-3 mb-5 middle">
          <Card style={{ width: "60%", height: "100%" }}>
            <h5 className="ml-3 mt-4">Reason for Payment</h5>
            <Row>
              <ToggleButtonGroup
                type="radio"
                name="PaymentReason"
                style={{ height: "100%", width: "100%" }}
                className="ml-5 mr-5"
              >
                {buttonlist1.map((buttonLabel, i) => (
                  <ToggleButton
                    id={"radio" + i}
                    value={buttonLabel}
                    variant="outline-primary"
                    className="mb-3"
                    onChange={handleChange}
                  >
                    {buttonLabel}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Row>
            <h5 className="ml-3 mt-5">Payment Method</h5>
            <Row>
              <ToggleButtonGroup
                type="radio"
                name="PaymentMethod"
                style={{ height: "100%", width: "100%" }}
                className="ml-5 mr-5"
              >
                {buttonlist2.map((buttonLabel, i) => (
                  <ToggleButton
                    id={"radio" + i}
                    value={buttonLabel}
                    variant="outline-primary"
                    className="mb-3"
                    onChange={handleChange}
                  >
                    {buttonLabel}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Row>
            <h5 className="ml-3 mt-5">User Information</h5>
            <Row className="ml-1 mr-1">
              <Col>
                <div className="ml-4 mr-1">
                  <text>First Name</text>
                  <Form.Control
                    placeholder="First Name"
                    value={profile.Firstname}
                    name="Firstname"
                    aria-label="firstname"
                    aria-describedby="firstname"
                    onChange={handleChange}
                  />
                </div>
              </Col>
              <Col>
                <div className="mr-4 ml-1">
                  <text>Last Name</text>
                  <Form.Control
                    placeholder="Last Name"
                    value={profile.Lastname}
                    name="Lastname"
                    aria-label="lastname"
                    type="text"
                    aria-describedby="lastname"
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>
            <Row className="ml-2 mr-2">
              <Col className="mt-3 ml-3 mr-3">
                <text className="mt-3 ml-2 mr-3">Email</text>
                <Form.Control
                  placeholder="Email"
                  value={profile.Email}
                  name="Email"
                  type="text"
                  aria-label="email"
                  aria-describedby="email"
                  onChange={handleChange}
                />
              </Col>
            </Row>
            <Row className="ml-2 mr-2">
              <Col className="mt-3 ml-3 mr-3">
                <text className="mt-3">Amount</text>
                <Form.Control
                  placeholder="$"
                  value={profile.Amount}
                  name="Amount"
                  aria-label="Amount"
                  aria-describedby="Amount"
                  onChange={handleChange}
                  type="decimal"
                />
              </Col>
            </Row>
            <Row className="ml-2 mr-2">
              <Col className="mt-3 ml-3 mr-3 mb-3">
                <text className="mt-3">Comments</text>
                <InputGroup>
                  <FormControl
                    as="textarea"
                    aria-label="With textarea"
                    value={profile.Comments}
                    name="Comments"
                    onChange={handleChange}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className="ml-4 mb-2">
              <div className="paypal">
                <PayPal profile={profile} handleSubmit={handleSubmit} />
                <div className="clear">
                  <Button variant="danger" id="clear3" type="refresh" size="lg">
                    Clear
                  </Button>
                </div>
              </div>
            </Row>
            <Row className="mt-2 ml-4">
              <Elements stripe={stripePromise}>
                <Stripe
                  profile={profile}
                  handleSubmitData={handleSubmit}
                  clientSecret={clientSecret}
                />
              </Elements>
            </Row>
          </Card>
        </div>
      </Form>
    </React.Fragment>
  );
}
export default Payment;
