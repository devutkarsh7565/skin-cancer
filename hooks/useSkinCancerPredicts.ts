export const useSkinCancerPrediction = () => {
  async function uploadFile(formData: FormData, apiUrl: string): Promise<void> {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error accordingly
    }
  }

  return uploadFile;
};
