<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class SendMessageToSW
{
    /* https://stackoverflow.com/questions/65527330/socket-io-3-and-php-integration */
    /* Elephantio https://wisembly.github.io/elephant.io/ */
    public function __invoke(HttpClientInterface $client, string $eventName, array $data) {
        
        $host = 'http://localhost:3000';
        $first = $client->request('GET', 'http://localhost:3000/socket.io/?EIO=4&transport=polling&t=N8hyd6w');
        $content = $first->getContent();        
        $index = strpos($content, 0);        
        $res = json_decode(substr($content, $index + 1), true);        
        $sid = $res['sid'];        
        $client->request('POST', "{$host}/socket.io/?EIO=4&transport=polling&sid={$sid}", [
                'body' => '40'
            ]);        
        $client->request('GET', "{$host}/socket.io/?EIO=4&transport=polling&sid={$sid}");
        
        $data = [$eventName, $data];
        $client->request('POST', "{$host}/socket.io/?EIO=4&transport=polling&sid={$sid}", [
            'body' => sprintf('42%s', json_encode($data))
        ]);
    }
}