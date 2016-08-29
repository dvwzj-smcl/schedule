<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Event;
use App\Models\Calendar\Slot;
use App\Models\Calendar\SubCategory;
use App\Models\User\Customer;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use BF;
use Input;
use Mockery\CountValidator\Exception;

class EventController extends Controller
{

    public function index() {
        // for Summary Page
        try {
            $isOrganizer = BF::isOrganizer();
            // parse date
            if (empty($dateParam)) $date = Carbon::now();
            else $date = Carbon::parse($dateParam);
            $date2 = clone $date;

            if (Input::has(['start', 'end'])) {
                $start = Carbon::createFromTimestamp(Input::get('start'));
                $end = Carbon::createFromTimestamp(Input::get('end'));
                $query = Slot::with('category')->byDate($start, $end)->where('sc_doctor_id', $doctor_id);
            } else {
                $query = Slot::with('category')->byDate($date)->where('sc_doctor_id', $doctor_id);
            }

            $slots = $query->get();
            $events = [];
            $self_id = BF::getUserId();
            $nameLookup = static::getSubCategoryNames();

            foreach ($slots as $slot) {
                $slot->title = $slot->category->name;
                foreach ($slot->events as $event) {
                    $customer = null;
                    if ($isOrganizer || $self_id == $event->sale_id) {
                        $customer = $event->customer->toArray();
                    }
                    $events[] = [
                        'event_id' => $event->id,
                        'start' => $event->start,
                        'end' => $event->end,
                        'sale_id' => $event->sale_id,
                        'slot_id' => $event->sc_slot_id,
                        'category_id' => $slot->category->id,
                        'sub_category_id' => $event->sc_sub_category_id,
                        'status' => $event->status,
                        'title' => $nameLookup[$slot->category->id][$event->sc_sub_category_id],
                        'customer' => $customer
                    ];
                }
                unset($slot['category']);
                unset($slot['events']);
            }
            return BF::result(true, ['slots' => $slots, 'events' => $events, 'time' => $date2], '[schedule] get slot');
        }catch(\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    public function create() {}

    public function store(Request $request)
    {
        try {
            $slot = Slot::find($request->get('slot_id'));
            if($slot == null) throw new \Exception('Slot not found');

            // check validity
            $event = $request->get('event');
            $subcat = SubCategory::find($event['sc_sub_category_id']);
            if($subcat == null) throw new \Exception('Invalid subcategory');
            if($subcat->sc_category_id !== $slot->sc_category_id) throw new \Exception('Invalid category');

            // set time
            $start = Carbon::parse($event['start'], 'UTC')->setTimezone('Asia/Bangkok');
            //$end = clone $start; $end->addMinutes($subcat->duration);
            $end = $start->copy()->addMinutes($subcat->duration);
            $event['start'] = $start;
            $event['end'] = $end;

            // check overlap time
            if(!$request->get('requested')) {
                if(Event::where('sc_slot_id', $slot->id)->where('start', '<', $end)->where('end', '>', $start)->count() > 0){
                    // todo: pending status
                    throw new \Exception('Time overlap with another event');
                };
                $event['status'] = 'approved';
            } else {
                $event['status'] = 'pending';
            }

            // create customer
            $customer = $request->get('customer');
            $newCustomer = Customer::create($customer);
            if($newCustomer == null) throw new \Exception('Cannot create customer of this event');
            $event['sc_customer_id'] = $newCustomer->id;

            // create event
            $newEvent = Event::create($event);
            if($newEvent == null) {
                $newCustomer->delete();
                throw new \Exception('Cannot create event');
            }
            return BF::result(true, ['event' => $event]);
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }
    }

    public function show($id) {}

    public function edit($id) {}

    // only update customer info
    public function update(Request $request, $id)
    {
        try {
            $event = Event::find($id);
            if($event == null) throw new \Exception('Cannot find event');

            // update customer
            $customerReq = $request->get('customer');
            $event->customer->update($customerReq);
            return BF::result(true, ['event' => $event]);
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }
    }

    public function destroy($id) {}

    public function setStatus($id, $status) {
        try {
            $event = Event::find($id);
            if($event == null) throw new \Exception('Cannot find event');
            if($status == 'approve') $event->approve();
            else if($status == 'pending') $event->pending();
            else if($status == 'reject') $event->reject();
            else if($status == 'cancel') $event->cancel();

            return BF::result(true, ['event' => $event]);
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }
    }

    public function setConfirmStatus($id, $status) {
        try {
            $event = Event::find($id);
            if($event == null) throw new \Exception('Cannot find event');
            if($status == 'called') $event->called();
            else if($status == 'messaged') $event->messaged();
            else if($status == 'called-confirmed') $event->calledConfirmed();
            else if($status == 'messaged-confirmed') $event->messagedConfirmed();

            return BF::result(true, ['event' => $event]);
        } catch(\Exception $e) {
            return BF::result(false, $e->getMessage());
        }
    }
}
