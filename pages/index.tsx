import React, { useState } from "react";
import { UseFormProps, useForm } from "react-hook-form";
import { object, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import useToast from "@/hooks/useToast";
import {
  ArrowUpTrayIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "react-query";
import { useSkinCancerPrediction } from "@/hooks/useSkinCancerPredicts";
import axios from "axios";

export const studentProfileEditSchema = object({
  image: string().nonempty("Please upload your profile image."),
});

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

const Home = () => {
  const [cancerData, setCancerData] = useState<File>();
  const methods = useZodForm({
    schema: studentProfileEditSchema,
    defaultValues: {
      // number: creator?.mobileNumber as string | undefined,
    },
  });

  async function uploadFile(data: File): Promise<any> {
    try {
      // Create a new FormData instance
      console.log(data, "data");
      const formData = new FormData();

      // Append the file data to the FormData instance
      formData.append("file", data);
      console.log("enter in upload file", formData);
      const response = await axios.post(
        "https://skin-cancer-apis.onrender.com/predict/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response) {
        throw new Error("Failed to upload file");
      }

      console.log("no error occur", response);

      return response?.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error accordingly
    }
  }

  // const apiUrl = ;

  const {
    isLoading,
    isSuccess,
    error,
    mutate: upload,
    data,
  } = useMutation(uploadFile);

  const [updating, setUpdating] = useState<boolean>(false);

  // console.log(data, "data");

  const { warningToast, errorToast, successToast } = useToast();
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 w-full flex-col gap-5">
        <form
          className="flex flex-col w-full h-full items-center justify-center"
          onSubmit={methods.handleSubmit(async (values) => {
            setUpdating(true);
            console.log(values, "values");

            const fileString = values?.image;

            try {
              console.log("hello world");
              await upload(cancerData as File);
            } catch (e) {
              console.log(e);
            }
            setUpdating(false);
          })}
        >
          <div className="bg-white w-[40rem] h-full rounded-xl flex flex-col gap-5 p-5">
            {methods?.watch("image") ? (
              <></>
            ) : (
              <div className="border-dashed relative top-0 left-0 right-0 bottom-0 border-2 border-neutral-400 w-full h-[23rem] rounded-xl flex items-center justify-center gap-2 flex-col">
                <div className="absolute  top-7 w-full h-full">
                  <div className="flex flex-col items-center justify-center gap-4 w-full h-full text-neutral-500">
                    <ArrowUpTrayIcon className="text-sky-500 w-20" />
                    <span className="text-xl font-medium text-neutral-700">
                      Drag your image or Drop
                    </span>
                    <h2 className="text-sm ">Supports: jpg,png,jpeg</h2>
                  </div>
                  <input
                    placeholder="Update file"
                    type="file"
                    accept="image/jpeg, image/jpg,image/png"
                    className="z-2 absolute left-0 right-0 bottom-0 top-0 w-full h-full cursor-pointer opacity-0"
                    onChange={(e) => {
                      if (e.currentTarget.files && e.currentTarget.files[0]) {
                        if (e.currentTarget.files[0].size <= 1024000) {
                          setCancerData(e.currentTarget.files[0]);
                          const reader = new FileReader();
                          reader.onload = () => {
                            methods.setValue("image", reader.result as string);
                          };
                          reader.readAsDataURL(e.currentTarget.files[0]);
                        } else {
                          warningToast("Upload cover image upto 1 MB of size.");
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
            {methods?.watch("image") ? (
              <div className="flex flex-col items-center gap-5 justify-center w-full p-3 rounded-xl border-2 border-dashed border-neutral-300">
                <div className="relative aspect-square w-full h-[20rem]  object-cover">
                  <Image
                    fill
                    src={methods.watch().image}
                    alt={`image`}
                    className="aspect-square w-14 rounded-xl object-cover"
                  />
                </div>
                <div className="w-full flex items-center gap-4">
                  <div
                    onClick={() => methods?.setValue("image", "")}
                    className="py-2 px-3 w-1/2 rounded-xl flex gap-2 justify-center items-center bg-red-500 text-white cursor-pointer hover:bg-red-600 duration-150"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <button type="button" className="">
                      Delete
                    </button>
                  </div>
                  <button
                    className="w-1/2 rounded-xl py-2 px-3 text-white bg-green-500 hover:bg-green-600 duration-150"
                    type="submit"
                  >
                    Start Analysis
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="text-red-700 text-3xl font-medium">
            Cancer type: {isSuccess && data ? data.prediction : "Loading..."}
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;
