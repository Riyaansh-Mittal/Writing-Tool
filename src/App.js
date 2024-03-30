import React, { useState } from "react";
import { Button, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Block from "./components/Block";

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [blockType, setBlockType] = useState("text");
  const dispatch = useDispatch();
  const blocks = useSelector((state) => state.blocks);

  const showModal = () => setIsModalVisible(true);

  const handleOk = () => {
    dispatch({ type: "ADD_BLOCK", payload: { type: blockType, content: "" , imageContent: "" } });
    setIsModalVisible(false);
  };

  const handleCancel = () => setIsModalVisible(false);

  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDragStart = (e, index) => {
    e.dataTransfer.setData("dragIndex", index);
  };


  const onDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData("dragIndex");
    if (dragIndex === dropIndex.toString()) return;

    const itemBeingDragged = blocks[dragIndex];
    const replacedBlock = blocks[dropIndex];
    const newBlocks = [...blocks];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(dropIndex, 0, itemBeingDragged); 
    newBlocks.splice(dropIndex-dragIndex > 0 ? dropIndex-1 : dropIndex+1, 1);
    newBlocks.splice(dragIndex, 0, replacedBlock);
    dispatch({ type: "UPDATE_BLOCKS_ORDER", payload: newBlocks });
  };

  return (
    <div style={{ margin: "20px" }} className="app-container">
      <Button type="primary" style={{left: "50%"}} onClick={showModal}>
        Add Block
      </Button>
      <Modal
        title="Select Block Type"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          defaultValue="text"
          onChange={setBlockType}
          style={{ width: 120 }}
        >
          <Select.Option value="text">Text</Select.Option>
          <Select.Option value="picture">Picture</Select.Option>
        </Select>
      </Modal>
      <div className="blocks-container">
        {blocks.map((block, index) => (
          <Block
            key={index}
            index={index}
            block={block}
            onDragOver={onDragOver}
            onDragStart = {(e) => {onDragStart(e, index)}}
            onDrop={(e) => {onDrop(e, index);}}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
