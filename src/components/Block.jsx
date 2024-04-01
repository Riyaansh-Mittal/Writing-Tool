import React, { useEffect, useState } from "react";
import { Card, Button, Input } from "antd";
import { useDispatch } from "react-redux";

function Block({
  index,
  block,
  onDragOver,
  onDragStart,
  onDrop,
  onTouchStart,
}) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isImageEditing, setIsImageEditing] = useState(false);
  const [content, setContent] = useState(block.content || "");
  const [imageContent, setImageContent] = useState(block.imageContent);
  const [showChangeImageButton, setShowChangeImageButton] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  const removeBlock = () => dispatch({ type: "REMOVE_BLOCK", payload: index });
  const editBold = () => dispatch({ type: "BOLD", payload: {index, bold: !block.bold} })
  const editItalics = () => dispatch({ type: "ITALICS", payload: {index, italics: !block.italics} });
  const editUnderline = () => dispatch({ type: "UNDERLINE", payload: {index, underline: !block.underline} });

  console.log(block)

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setContent(block.content);
  };
  const toggleImageEdit = () => setIsImageEditing(!isImageEditing);

  useEffect(() => {
    const words = content.trim().split(/\s+/);
    setWordCount(words[0] === "" ? 0 : words.length);
  }, [content]);

  const saveContent = () => {
    if (wordCount <= 250) {
      dispatch({ type: "EDIT_BLOCK", payload: { index, content } });
      setIsEditing(false);
    } else {
      alert("Maximum word count exceeded. Please limit to 250 words.");
    }
  };
  const saveImageContent = () => {
    dispatch({ type: "UPDATE_IMAGE", payload: { index, imageContent } });

    setIsEditing(true);
    setShowChangeImageButton(false);
    toggleImageEdit();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setImageContent(loadEvent.target.result);
        setShowChangeImageButton(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onTouchStart={onTouchStart}
      style={{ width: "600px", cursor: "move", marginBottom: "10px" }}
    >
      <Card
        style={{
          marginTop: "10px",
          background:
            block.type === "picture"
              ? `url(${block.imageContent}) center/cover no-repeat`
              : "",
          minHeight: "260px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onMouseLeave={() => {
          if (isEditing) {
            toggleEdit();
          }
        }}
      >
        <div style={{ height: "100%" }}>
          {block.type === "text" ? (
            !isEditing ? (
              <div
                onMouseMove={toggleEdit}
                style={{ fontFamily: "Times New Roman", fontSize: "12px", fontWeight: block.bold?'bold':'normal', fontStyle: block.italics?'italic':'normal', textDecoration: block.underline?'underline':'normal'}}
              >
                {block.content || "Click to edit text"}
              </div>
            ) : (
              <textarea
                style={{ maxWidth: "580px", width: "280px" }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            )
          ) : !isImageEditing ? (
            showChangeImageButton && (
              <Input type="file" onChange={handleFileChange} />
            )
          ) : !isEditing ? (
            <div
              onMouseMove={toggleEdit}
              style={{ fontFamily: "Times New Roman", fontSize: "12px" }}
            >
              {block.content || "Click to edit text"}
            </div>
          ) : (
            <textarea
              style={{ maxWidth: "580px", width: "280px" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          )}
          {isEditing && (
            <div
              style={{
                marginTop: "10px",
                position: "absolute",
                bottom: "10px",
              }}
            >
              <Button onClick={saveContent}>Save</Button>
              <Button onClick={toggleEdit} style={{ marginLeft: "5px" }}>
                Cancel
              </Button>
              <Button onClick={editBold} style={{backgroundColor: block.bold?'blue':'white', color: block.bold?'white':'black'}}>Bold</Button>
              <Button onClick={editUnderline} style={{backgroundColor: block.underline?'blue':'white', color: block.underline?'white':'black'}}>Underline</Button>
              <Button onClick={editItalics} style={{backgroundColor: block.italics?'blue':'white', color: block.italics?'white':'black'}}>Italics</Button>
            </div>
          )}
        </div>
        {!isImageEditing &&
          block.type === "picture" &&
          showChangeImageButton && (
            <div
              style={{
                marginTop: "10px",
                position: "absolute",
                bottom: "10px",
              }}
            >
              <Button onClick={saveImageContent}>Save</Button>
            </div>
          )}
        <Button
          onClick={removeBlock}
          style={{ position: "absolute", top: "10px", right: "10px" }}
        >
          Remove Block
        </Button>
      </Card>
    </div>
  );
}

export default Block;
