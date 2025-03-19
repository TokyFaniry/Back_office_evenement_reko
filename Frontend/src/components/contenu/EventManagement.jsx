import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  message,
  Modal,
  Space,
  Spin,
  Typography,
  Form,
  Input,
  Statistic,
  Progress,
  Row,
  Col,
  Breadcrumb,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  ArrowLeftOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../services/axiosInstance";
import moment from "moment";
import Countdown from "./Countdown";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
//const { Countdown } = Statistic;
function EventManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketCategories, setTicketCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isScanModalVisible, setIsScanModalVisible] = useState(false);
  const [scanInput, setScanInput] = useState("");

  // Récupération des détails de l'événement
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      message.error("Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  // Récupération des catégories de billets pour l'événement
  const fetchTicketCategories = async () => {
    try {
      const res = await axiosInstance.get(`/ticket-categories/event/${id}`);
      setTicketCategories(res.data);
    } catch (error) {
      console.error("Error fetching ticket categories:", error);
      message.error("Failed to load ticket categories.");
    }
  };

  useEffect(() => {
    fetchEventDetails();
    fetchTicketCategories();
  }, [id]);

  // Gestion de l'ajout d'une nouvelle catégorie de billet.
  const handleAddCategory = async (values) => {
    try {
      const payload = {
        eventId: id,
        name: values.name,
        price: values.price,
        quantity: values.quantity,
      };
      await axiosInstance.post(`/ticket-categories`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      message.success("Ticket category added successfully.");
      fetchEventDetails();
      fetchTicketCategories();
      setIsAddModalVisible(false);
    } catch (error) {
      console.error("Error adding ticket category:", error);
      const serverError =
        error.response?.data?.message || "Failed to add ticket category.";
      message.error(serverError);
    }
  };

  // Simulation du scan d'un billet
  const handleScanTicket = () => {
    if (scanInput.trim() === "") {
      message.error("Please enter a valid ticket code.");
    } else {
      message.success(`Ticket code ${scanInput} scanned successfully.`);
      setScanInput("");
      setIsScanModalVisible(false);
      fetchEventDetails();
    }
  };

  // Calcul des statistiques globales à partir des billets
  const totalSeats =
    event?.tickets && event.tickets.length > 0
      ? event.tickets.reduce((sum, t) => sum + t.quantity, 0)
      : event?.totalSeats || 0;
  const totalSold = event?.tickets?.reduce((sum, t) => sum + t.sold, 0) || 0;
  const remainingSeats = totalSeats - totalSold;

  //Calcul date
  const eventDateTime =
    event?.date && event?.heure
      ? moment(event.date)
          .set({
            hour: Number(event.heure.split(":")[0]),
            minute: Number(event.heure.split(":")[1]),
            second: 0,
            millisecond: 0,
          })
          .valueOf()
      : null;

  // Render des tickets de l'événement
  const renderTicketCards = () => (
    <Row gutter={[16, 16]}>
      {event.tickets.map((ticket) => (
        <Col xs={24} sm={12} md={8} key={ticket.id}>
          <Card bordered hoverable style={{ borderRadius: "8px" }}>
            <Title level={4}>{ticket.category.name}</Title>
            <Statistic title="Price" value={ticket.price} prefix="MGA" />
            <Progress
              percent={Math.round((ticket.sold / ticket.quantity) * 100)}
              status={ticket.sold === ticket.quantity ? "success" : "active"}
            />
            <Paragraph style={{ marginTop: 8 }}>
              Sold: {ticket.sold} / {ticket.quantity}
            </Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Render des catégories de billets
  const renderTicketCategories = () => (
    <Row gutter={[16, 16]}>
      {ticketCategories.map((category) => (
        <Col xs={24} sm={12} md={8} key={category.id}>
          <Card
            bordered
            hoverable
            style={{ borderRadius: "8px", textAlign: "center" }}
          >
            <Title level={4}>{category.name}</Title>
            <Statistic title="Price (MGA)" value={category.price} />
            <Statistic
              title="Quantity"
              value={category.quantity}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Calcul du résumé à partir des tickets
  const getTicketCategoriesSummary = () => {
    if (!event || !event.tickets || event.tickets.length === 0) return null;
    return event.tickets.reduce((acc, ticket) => {
      const categoryName = ticket.category?.name || "Unknown";
      if (!acc[categoryName]) {
        acc[categoryName] = { totalQuantity: 0, totalSold: 0 };
      }
      acc[categoryName].totalQuantity += ticket.quantity;
      acc[categoryName].totalSold += ticket.sold;
      return acc;
    }, {});
  };

  const ticketSummary = getTicketCategoriesSummary();

  return (
    // Ajustement pour tenir compte de la navbar et de la sidebar
    <div
      style={{
        marginLeft: "256px", // largeur de la sidebar
        paddingTop: "64px", // hauteur de la navbar
        padding: "24px",
        background: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Event Management</Breadcrumb.Item>
        <Breadcrumb.Item>{event?.title || "Event Details"}</Breadcrumb.Item>
      </Breadcrumb>

      {loading ? (
        <div style={{ textAlign: "center", paddingTop: "100px" }}>
          <Spin tip="Loading event details..." size="large" />
        </div>
      ) : (
        event && (
          <>
            {/* Hero Banner */}
            <div
              style={{
                width: "100%",
                height: "300px",
                backgroundImage: event.image?.imageUrl
                  ? `url(${event.image.imageUrl})`
                  : "linear-gradient(135deg, #667eea, #764ba2)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  padding: "16px",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                }}
              >
                <Title level={2} style={{ color: "white", margin: 0 }}>
                  {event.title}
                </Title>
                <Paragraph style={{ color: "white", margin: 0 }}>
                  {event.date && moment(event.date).format("LL")} •{" "}
                  {event.heure &&
                    moment(event.heure, "HH:mm").format("HH[h]mm")}{" "}
                  - {event.location}
                </Paragraph>
              </div>
            </div>
            {/* Countdown Timer */}
            <Countdown
              targetDate={eventDateTime}
              style={{ marginBottom: "24px" }}
            />

            {/* Event Description */}
            <Card style={{ marginBottom: "24px", borderRadius: "8px" }}>
              <Title level={3}>About the Event</Title>
              <Paragraph>{event.description}</Paragraph>
            </Card>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: "24px" }}>
              <Col xs={24} sm={8}>
                <Card style={{ textAlign: "center", borderRadius: "8px" }}>
                  <Statistic title="Total Seats" value={totalSeats} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ textAlign: "center", borderRadius: "8px" }}>
                  <Statistic title="Tickets Sold" value={totalSold} />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ textAlign: "center", borderRadius: "8px" }}>
                  <Statistic title="Remaining Seats" value={remainingSeats} />
                </Card>
              </Col>
            </Row>

            {/* Tabs for Tickets and Ticket Categories */}
            <Tabs
              defaultActiveKey="1"
              size="large"
              style={{ marginBottom: "24px" }}
            >
              <TabPane tab="Tickets" key="1">
                {event.tickets && event.tickets.length > 0 ? (
                  renderTicketCards()
                ) : (
                  <Empty description="No tickets available." />
                )}
              </TabPane>
              <TabPane tab="Ticket Categories" key="2">
                {ticketCategories && ticketCategories.length > 0 ? (
                  renderTicketCategories()
                ) : (
                  <Empty description="No ticket categories available." />
                )}
              </TabPane>
            </Tabs>

            {/* Ticket Summary */}
            {ticketSummary && (
              <Card
                title="Ticket Categories Summary (from tickets)"
                style={{ marginBottom: "24px", borderRadius: "8px" }}
              >
                <Row gutter={[16, 16]}>
                  {Object.entries(ticketSummary).map(([category, summary]) => (
                    <Col xs={24} sm={12} md={8} key={category}>
                      <Card
                        bordered
                        style={{ borderRadius: "8px", textAlign: "center" }}
                      >
                        <Title level={4}>{category}</Title>
                        <Statistic
                          title="Total Seats"
                          value={summary.totalQuantity}
                        />
                        <Statistic
                          title="Tickets Sold"
                          value={summary.totalSold}
                          style={{ marginTop: 8 }}
                        />
                        <Statistic
                          title="Remaining"
                          value={summary.totalQuantity - summary.totalSold}
                          style={{ marginTop: 8 }}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}

            {/* Action Buttons */}
            <Space style={{ marginBottom: "24px" }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalVisible(true)}
              >
                Add Ticket Category
              </Button>
              <Button
                type="default"
                icon={<QrcodeOutlined />}
                onClick={() => setIsScanModalVisible(true)}
              >
                Scan Ticket
              </Button>
            </Space>
          </>
        )
      )}

      {/* Modal for adding Ticket Category */}
      <Modal
        title="Add Ticket Category"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handleAddCategory}>
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              { required: true, message: "Please enter a category name" },
            ]}
          >
            <Input placeholder="e.g., VIP, Standard" />
          </Form.Item>
          <Form.Item
            label="Price (MGA)"
            name="price"
            rules={[
              { required: true, message: "Please enter the ticket price" },
            ]}
          >
            <Input type="number" placeholder="Price" />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              {
                required: true,
                message: "Please enter the available quantity",
              },
            ]}
          >
            <Input type="number" placeholder="Quantity" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Category
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for scanning ticket */}
      <Modal
        title="Scan Ticket"
        visible={isScanModalVisible}
        onCancel={() => setIsScanModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsScanModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="scan" type="primary" onClick={handleScanTicket}>
            Scan
          </Button>,
        ]}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="Ticket Code">
            <Input
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              placeholder="Enter ticket code to scan"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EventManagement;
