<?php
namespace App\Command;

use App\Service\SendMessageToSW;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class AwesomeProccess extends Command
{
    // the name of the command (the part after "bin/console")
    protected static $defaultName = 'app:awesome-proccess';

    private $sendMessageToSW = null;
    private $client = null;
    public function __construct(SendMessageToSW $sendMessageToSW, HttpClientInterface $client)
    {
        $this->sendMessageToSW = $sendMessageToSW;
        $this->client = $client;
        parent::__construct();
    }

    protected function configure(): void
    {
    
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {    
        while(true){
            if(rand(1,10000) %2 ) {
                $response = file_get_contents('https://api.thecatapi.com/v1/images/search');
                $url = json_decode($response,true)[0]["url"];
                $message = "Vi un lindo gatito 🐱!";
            } else {
                $response = file_get_contents('https://dog.ceo/api/breeds/image/random');
                $url = json_decode($response,true)['message'];
                $message = "Vi un lindo perrito 🐶!";
            }            
            $output->writeln("Hola mundo for command");
            $output->writeln($this->sendMessageToSW->__invoke($this->client, "awesome-proccess", compact('url', 'message')));
            sleep(15);
        }
        
        return Command::SUCCESS;
    }
}