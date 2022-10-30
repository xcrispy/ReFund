import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function CheckOutModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="example-custom-modal-styling-title"
      centered
    >
      {/*}  <Modal.Header closeButton>
       
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>

      </Modal.Header>   */}
      <Modal.Body>{props.children}</Modal.Body>
      {/*} <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
    </Modal.Footer> */}
    </Modal>
  );
}
