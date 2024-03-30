import React, { useEffect, useRef, useState } from "react";
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

  const [draggedIndex, setDraggedIndex] = useState(null);


  const onTouchStart = (e, index) => {
    if(draggedIndex === null){setDraggedIndex(index)}
    else{

      const itemBeingDragged = blocks[draggedIndex];
    const replacedBlock = blocks[index];
    const newBlocks = [...blocks];
    console.log(newBlocks)
    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(index, 0, itemBeingDragged); 
    newBlocks.splice(index-draggedIndex > 0 ? index-1 : index+1, 1);
    newBlocks.splice(draggedIndex, 0, replacedBlock);
    console.log(newBlocks)
    setDraggedIndex(null)
    dispatch({ type: "UPDATE_BLOCKS_ORDER", payload: newBlocks });
  }
  };
  
  // const onTouchEnd = (e, dropIndex) => {
  //   clearTimeout(touchStartTimer); // Clear the timeout to prevent setting draggedIndex if it was a tap
  //   setTouchStartTimer(null);
  //   console.log(dropIndex)
  //   console.log(draggedIndex)
  //   if (draggedIndex === null || draggedIndex === dropIndex) return;
  //   console.log(draggedIndex)
  //   setDraggedIndex(dropIndex); // Reset the dragged index
  //   const itemBeingDragged = blocks[draggedIndex];
  //   const replacedBlock = blocks[dropIndex];
  //   const newBlocks = [...blocks];
  //   console.log(newBlocks)
  //   newBlocks.splice(draggedIndex, 1);
  //   newBlocks.splice(dropIndex, 0, itemBeingDragged); 
  //   newBlocks.splice(dropIndex-draggedIndex > 0 ? dropIndex-1 : dropIndex+1, 1);
  //   newBlocks.splice(draggedIndex, 0, replacedBlock);
  //   console.log(newBlocks)
  //   dispatch({ type: "UPDATE_BLOCKS_ORDER", payload: newBlocks });
  // };

  const blocksContainerRef = useRef(null);

  useEffect(() => {
    // Directly attach the onTouchMove event listener to the blocks container
    const blocksContainer = blocksContainerRef.current;
    const touchMoveHandler = (event) => {
      // Prevent the default touch behavior
      event.preventDefault();
    };

    if (blocksContainer) {
      blocksContainer.addEventListener("touchmove", touchMoveHandler, { passive: false });
    }

    // Make sure to remove the event listener on cleanup
    return () => {
      if (blocksContainer) {
        blocksContainer.removeEventListener("touchmove", touchMoveHandler);
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  

  return (
    <div ref={blocksContainerRef} style={{ margin: "20px" }} className="app-container">
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
            onTouchStart={(e) => onTouchStart(e, index)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;