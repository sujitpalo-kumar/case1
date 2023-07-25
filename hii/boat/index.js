const API_KEY = "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";
const submitIcon = document.querySelector("#submit-icon");
const input = document.querySelector("input");
const image = document.querySelector(".image-section");
const getImages = async () => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: input.value,
      n: 4,
      size: "256x256",
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      options
    );
    const data = await response.json();
    console.log(data);
    data?.data.forEach((imageObject) => {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("image-container");
      const imageElement = document.createElement("img");
      imageElement.setAttribute("src", imageObject.url);
      imageContainer.append(imageElement);
      image.append(imageContainer);
    });
  } catch (error) {
    console.error(error);
  }
};
submitIcon.addEventListener("click", getImages);
