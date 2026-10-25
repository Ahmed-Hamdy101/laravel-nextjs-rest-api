<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChartResources;
use App\Models\Order;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;
use function App\Http\Controllers\now;

class DashboardController extends Controller
{
    /** Return order totals grouped by day for the last seven days. */
    #[OA\Get(
        path: '/v1/chart',
        summary: 'Get dashboard chart data',
        security: [['bearerAuth' => []]],
        tags: ['Dashboard'],
        responses: [new OA\Response(response: 200, description: 'Chart data retrieved successfully')]
    )]
    public function chart(Request $request)
    {
        // show chart data for the last 7 days
        $order= Order::query()
        ->join('order_items', 'orders.id', '=', 'order_items.order_id')
        ->selectRaw("DATE(orders.created_at) as date, SUM(order_items.price * order_items.quantity) as sum")
            ->groupBy('date')
            ->where('orders.created_at', '>=', now()->subDays(7))
            ->get();

        return ChartResources::collection($order);
    }
}
