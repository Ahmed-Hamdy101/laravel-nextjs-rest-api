<?php

namespace App\Http\Controllers\API\Order\uploads;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImageUploadRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;
use function App\Http\Controllers\API\response;

class ImageController extends Controller
{
    /** Store an image and return its public URL. */
    #[OA\Post(
        path: '/v1/uploads',
        summary: 'Upload an image',
        security: [['bearerAuth' => []]],
        tags: ['Uploads'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    required: ['image'],
                    properties: [
                        new OA\Property(property: 'image', type: 'string', format: 'binary')
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Image uploaded successfully'),
            new OA\Response(response: 422, description: 'Invalid image upload'),
        ]
    )]
    public function upload(ImageUploadRequest $request): JsonResponse
    {
        $path = $request->file('image')->store('images', 'public');
        $url  = Storage::disk('public')->url($path);

        return response()->json([
            'filename' => basename($path),
            'url'      => $url,
        ], Response::HTTP_CREATED);
    }
}
