<?php
include 'config.php';

$response = array('success' => false, 'message' => '');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Periksa apakah semua data POST tersedia
    if (isset($_POST['item_name'], $_POST['item_cost'], $_POST['description'], $_POST['quantity'])) {
        $item_name = $_POST['item_name'];
        $item_cost = $_POST['item_cost'];
        $description = $_POST['description'];
        $quantity = $_POST['quantity'];
        $available = $quantity; // Initially, available = quantity

        // Log data yang diterima untuk debugging
        error_log("Received data: item_name=$item_name, item_cost=$item_cost, description=$description, quantity=$quantity");

        $sql = "INSERT INTO products (item_name, item_cost, description, quantity, available) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            $response['message'] = "Prepare failed: " . $conn->error;
            error_log("Prepare failed: " . $conn->error);
        } else {
            $stmt->bind_param("sissi", $item_name, $item_cost, $description, $quantity, $available);

            if ($stmt->execute()) {
                $response['success'] = true;
            } else {
                $response['message'] = "Execute failed: " . $stmt->error;
                error_log("Execute failed: " . $stmt->error);
            }

            $stmt->close();
        }
    } else {
        $response['message'] = "Missing required fields";
        error_log("Missing required fields: " . print_r($_POST, true));
    }
} else {
    $response['message'] = "Invalid request method";
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
}

$conn->close();
echo json_encode($response);
?>